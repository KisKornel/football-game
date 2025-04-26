import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { TeamType, Vec3 } from "./types/types";
import RAPIER, { RigidBody, World } from "@dimforge/rapier3d-compat";

interface RoomState {
  world: World;
  ballBody: RigidBody;
  eventQueue: RAPIER.EventQueue;
  sensorMap: Map<number, Omit<TeamType, "no">>;
}

const TICK = 1 / 60;

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const rooms = new Map<string, RoomState>();

app.prepare().then(async () => {
  await RAPIER.init();

  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
    path: "/socket.io",
  });

  io.on("connection", (socket) => {
    console.log("Connected server!");

    socket.on("join-room", async (roomId) => {
      socket.join(roomId);
      console.log(`${socket.id} joined room ${roomId}`);

      if (!rooms.has(roomId)) {
        const world = new World({ x: 0, y: -9.81, z: 0 });

        const floorDesc = RAPIER.ColliderDesc.cuboid(
          10,
          0.1,
          10,
        ).setTranslation(0, 0, 0);
        world.createCollider(floorDesc);

        function quatFromY(angle: number) {
          return new RAPIER.Quaternion(
            0,
            Math.sin(angle / 2),
            0,
            Math.cos(angle / 2),
          );
        }

        const wallDefs = [
          { scale: [17, 0.3, 0.1], pos: [0, 0.15, 7.5], rotY: 0 },
          { scale: [17, 0.3, 0.1], pos: [0, 0.15, -7.5], rotY: 0 },

          { scale: [5.5, 0.3, 0.1], pos: [9.5, 0.15, 3.8], rotY: Math.PI / 2 },
          { scale: [5.5, 0.3, 0.1], pos: [9.5, 0.15, -3.8], rotY: Math.PI / 2 },
          { scale: [5.5, 0.3, 0.1], pos: [-9.5, 0.15, 3.8], rotY: Math.PI / 2 },
          {
            scale: [5.5, 0.3, 0.1],
            pos: [-9.5, 0.15, -3.8],
            rotY: Math.PI / 2,
          },

          { scale: [1.4, 0.3, 0.1], pos: [-9, 0.15, -7], rotY: Math.PI / 4 },
          { scale: [1.4, 0.3, 0.1], pos: [9, 0.15, -7], rotY: -Math.PI / 4 },
          { scale: [1.4, 0.3, 0.1], pos: [9, 0.15, 7], rotY: Math.PI / 4 },
          { scale: [1.4, 0.3, 0.1], pos: [-9, 0.15, 7], rotY: -Math.PI / 4 },

          { scale: [1.8, 0.3, 0.1], pos: [9.9, 0.15, 0], rotY: Math.PI / 2 },
          { scale: [1.8, 0.3, 0.1], pos: [-9.9, 0.15, 0], rotY: Math.PI / 2 },
          { scale: [0.3, 0.3, 0.1], pos: [9.8, 0.15, 0.95], rotY: 0 },
          { scale: [0.3, 0.3, 0.1], pos: [9.8, 0.15, -0.95], rotY: 0 },
          { scale: [0.3, 0.3, 0.1], pos: [-9.8, 0.15, 0.95], rotY: 0 },
          { scale: [0.3, 0.3, 0.1], pos: [-9.8, 0.15, -0.95], rotY: 0 },
        ];

        wallDefs.forEach(({ scale, pos, rotY }) => {
          const [sx, sy, sz] = scale;
          const [px, py, pz] = pos;
          const desc = RAPIER.ColliderDesc.cuboid(sx / 2, sy / 2, sz / 2)
            .setTranslation(px, py, pz)
            .setRotation(quatFromY(rotY));
          world.createCollider(desc);
        });

        const goalDefs = [
          { base: [9.55, 0, 0], rotY: Math.PI / 2, team: "home" as TeamType },
          { base: [-9.55, 0, 0], rotY: -Math.PI / 2, team: "away" as TeamType },
        ];

        const sensorMap = new Map<number, Omit<TeamType, "no">>();
        goalDefs.forEach(({ base, rotY, team }) => {
          const [bx, by, bz] = base;

          world.createCollider(
            RAPIER.ColliderDesc.cuboid(1 / 2, 0.1 / 2, 0.1 / 2)
              .setTranslation(bx, by + 2, bz)
              .setRotation(quatFromY(rotY)),
          );

          world.createCollider(
            RAPIER.ColliderDesc.cuboid(0.1 / 2, 1 / 2, 0.1 / 2)
              .setTranslation(
                bx + Math.cos(rotY) * -0.5,
                by + 1,
                bz + Math.sin(rotY) * -0.5,
              )
              .setRotation(quatFromY(rotY)),
          );

          world.createCollider(
            RAPIER.ColliderDesc.cuboid(0.1 / 2, 1 / 2, 0.1 / 2)
              .setTranslation(
                bx + Math.cos(rotY) * 0.5,
                by + 1,
                bz + Math.sin(rotY) * 0.5,
              )
              .setRotation(quatFromY(rotY)),
          );

          const sensorDesc = RAPIER.ColliderDesc.cuboid(1.2 / 2, 1 / 2, 0.1 / 2)
            .setTranslation(
              bx + Math.cos(rotY) * 0.15,
              by + 1,
              bz + Math.sin(rotY) * 0.15,
            )
            .setRotation(quatFromY(rotY))
            .setSensor(true);

          const sensor = world.createCollider(sensorDesc);

          sensorMap.set(sensor.handle, team);
        });

        const desc = RAPIER.RigidBodyDesc.dynamic()
          .setTranslation(0, 5, 0)
          .setLinearDamping(0.5)
          .setAngularDamping(0.3);

        const ballBody = world.createRigidBody(desc);
        ballBody.setRotation(new RAPIER.Quaternion(0, 0, 0, 1), true);
        ballBody.setAngvel({ x: 0, y: 0, z: 0 }, true);

        const ballCollider = RAPIER.ColliderDesc.ball(0.135)
          .setRestitution(0.6)
          .setFriction(0.8);
        world.createCollider(ballCollider, ballBody);

        const eventQueue = new RAPIER.EventQueue(true);

        rooms.set(roomId, { world, ballBody, eventQueue, sensorMap });
      }
    });

    socket.on("move-character", (data) => {
      io.to(data.roomId).emit("playerMoved", data);
    });

    socket.on(
      "hit-ball",
      ({ roomId, force }: { roomId: string; force: Vec3 }) => {
        const st = rooms.get(roomId);
        if (st) st.ballBody.applyImpulse(force, true);
      },
    );

    socket.on(
      "goal-scored",
      ({ roomId, team }: { roomId: string; team: TeamType }) => {
        io.to(roomId).emit("goal-scored", { team });

        const inst = rooms.get(roomId);
        if (inst) {
          inst.ballBody.setTranslation({ x: 0, y: 5, z: 0 }, true);
          inst.ballBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
          inst.ballBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
        }
      },
    );

    socket.on("disconnect", (reason) => {
      console.log(`Client disconnected: ${socket.id} (${reason})`);
    });
  });

  setInterval(() => {
    for (const [roomId, inst] of rooms) {
      const { world, ballBody, eventQueue, sensorMap } = inst;

      world.step(eventQueue);

      eventQueue.drainContactForceEvents((event) => {
        const h1 = event.collider1();
        const h2 = event.collider2();
        const ballHandle = ballBody.handle;

        let sensorHandle: number | null = null;
        if (h1 === ballHandle) sensorHandle = h2;
        else if (h2 === ballHandle) sensorHandle = h1;
        if (sensorHandle == null) return;

        console.log("Sensor: ", sensorHandle);

        const team = sensorMap.get(sensorHandle);
        if (team) {
          io.to(roomId).emit("goal-scored", { team });

          ballBody.setTranslation({ x: 0, y: 5, z: 0 }, true);
          ballBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
          ballBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
        }
      });

      const p = ballBody.translation();
      const v = ballBody.linvel();
      const rot = ballBody.rotation();
      io.to(roomId).emit("world-tick", {
        position: { x: p.x, y: p.y, z: p.z },
        velocity: { x: v.x, y: v.y, z: v.z },
        rotation: { x: rot.x, y: rot.y, z: rot.z, w: rot.w },
      });
    }
  }, TICK * 1000);

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
