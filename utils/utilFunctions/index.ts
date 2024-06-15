// Function to generate chatId based on two userIds
export const generateChatId = (userId1: string, userId2: string) => {
    const sortedIds = [userId1, userId2].sort()
    return `${sortedIds[0]}_${sortedIds[1]}`
}
