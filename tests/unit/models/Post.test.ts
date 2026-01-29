import { Post, ReactionType } from '@src/models/Post';

describe('Post', () => {
    // Test Case 1: Post constructor initializes correctly
    test('should initialize correctly with provided data', () => {
        const post = new Post(1, 'image.jpg', 'Test Caption');
        expect(post.id).toBe(1);
        expect(post.imageUrl).toBe('image.jpg');
        expect(post.caption).toBe('Test Caption');
        expect(post.reactions).toEqual({ like: 0, wow: 0, laugh: 0 });
    });

    // Test Case 2: Post constructor initializes correctly with default reactions
    test('should initialize reactions to default values if not provided', () => {
        const post = new Post(1, 'image.jpg', 'Test Caption');
        expect(post.reactions.like).toBe(0);
        expect(post.reactions.wow).toBe(0);
        expect(post.reactions.laugh).toBe(0);
    });

    // Test Case 3: addReaction increments the correct reaction type
    test('addReaction should increment the count for the specified reaction type', () => {
        const post = new Post(2, 'another.png', 'Another Post');

        // Add a 'like' reaction
        post.addReaction('like');
        expect(post.reactions.like).toBe(1);
        expect(post.reactions.wow).toBe(0);
        expect(post.reactions.laugh).toBe(0);

        // Add another 'like' reaction
        post.addReaction('like');
        expect(post.reactions.like).toBe(2);

        // Add a 'wow' reaction
        post.addReaction('wow');
        expect(post.reactions.wow).toBe(1);
        expect(post.reactions.like).toBe(2); // Ensure other reactions are unaffected

        // Add a 'laugh' reaction
        post.addReaction('laugh');
        expect(post.reactions.laugh).toBe(1);
        expect(post.reactions.wow).toBe(1); // Ensure other reactions are unaffected
    });

    // Test Case 4: addReaction handles multiple reaction types correctly
    test('addReaction should handle multiple different reaction types', () => {
        const post = new Post(3, 'multi.gif', 'Multi Reaction Post');

        post.addReaction('like');
        post.addReaction('wow');
        post.addReaction('like');
        post.addReaction('laugh');
        post.addReaction('wow');

        expect(post.reactions.like).toBe(2);
        expect(post.reactions.wow).toBe(2);
        expect(post.reactions.laugh).toBe(1);
    });
});