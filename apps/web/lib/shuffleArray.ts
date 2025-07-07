export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = newArray[j];
    newArray[j] = newArray[i] as T;
    newArray[i] = temp as T;
  }
  return newArray;
}
