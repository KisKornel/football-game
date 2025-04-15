import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CharacterType } from "@/types/types";

interface State {
  characters: CharacterType[];
}

interface Actions {
  setCharacters: (characters: CharacterType[]) => void;
  addCharacter: (character: CharacterType) => void;
  updateCharacter: (character: CharacterType) => void;
  removeCharacter: (id: string) => void;
  getCharactersById: (id: string) => CharacterType | undefined;
}

const useCharactersStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      characters: [],
      setCharacters: (characters) => set({ characters }),
      addCharacter: (character) =>
        set((state) => ({ characters: [...state.characters, character] })),
      updateCharacter: (character) =>
        set((state) => ({
          characters: state.characters.map((c) =>
            c.id === character.id ? character : c,
          ),
        })),
      removeCharacter: (id) =>
        set((state) => ({
          characters: state.characters.filter((c) => c.id !== id),
        })),
      getCharactersById: (id) => {
        const character = get().characters.find((c) => c.id === id);

        return character;
      },
    }),
    {
      name: "characters",
      partialize: (state) => ({
        characters: state.characters,
      }),
    },
  ),
);

export default useCharactersStore;
