import create from 'zustand'
type State = {
    darkMode: boolean
}
const mode = create(set => ({
    darkMode: true,
    toggleMode: () => set((state: State) => ({ darkMode: !state.darkMode }))
}));


const useMode = () => {
    const darkMode = mode((state: any) => state.darkMode);
    const toggleMode = mode((state: any) => state.toggleMode);
    return {
        darkMode,
        toggleMode
    }
}

export default useMode;