import { AppController } from '@src/controllers/AppController';
import { AppView } from '@src/views/AppView';
import { Post } from '@src/models/Post';

// Mock the AppView class to avoid any DOM interactions
// We only want to test the controller's logic in isolation.
jest.mock('@src/views/AppView');

describe('AppController', () => {
    let controller: AppController;
    let mockView: jest.Mocked<AppView>;

    beforeEach(() => {
        // Clear all mocks before each test to ensure a clean slate
        jest.clearAllMocks();

        // Create a new mocked instance of AppView
        mockView = new (AppView as jest.Mock<AppView>)() as jest.Mocked<AppView>;
        
        // Instantiate the controller with the mocked view
        controller = new AppController(mockView);
    });

    // Test suite for the init() method
    describe('init', () => {
        it('should bind event handlers, seed initial data, and render the view', () => {
            // Call the initialization method
            controller.init();

            // Check that view bindings for creating posts and reacting are set up
            expect(mockView.bindCreate).toHaveBeenCalledTimes(1);
            expect(mockView.bindReact).toHaveBeenCalledTimes(1);

            // Check that the view's render method is called to display the seeded posts
            // The controller's 'posts' property should have 2 posts after seeding.
            expect(mockView.render).toHaveBeenCalledWith(expect.any(Array));
            expect(mockView.render.mock.calls[0][0].length).toBe(2);
        });
    });

    // Test suite for the handleCreatePost() method
    describe('handleCreatePost', () => {
        beforeEach(() => {
            // Initialize the controller to bind the handler
            controller.init();
        });

        it('should create a new post, render it, and reset the form on valid input', () => {
            const imageUrl = 'http://example.com/image.png';
            const caption = 'A valid caption';

            // Manually call the handler, simulating a view event
            const createHandler = mockView.bindCreate.mock.calls[0][0];
            createHandler(imageUrl, caption);

            // Verify that no error message was shown
            expect(mockView.showMessage).not.toHaveBeenCalled();
            expect(mockView.clearMessage).toHaveBeenCalledTimes(1);

            // Check that render was called with an updated list of posts (3 total: 2 seeded + 1 new)
            expect(mockView.render).toHaveBeenCalledTimes(2); // 1 from init, 1 from create
            const renderedPosts = mockView.render.mock.calls[1][0] as Post[];
            expect(renderedPosts.length).toBe(3);
            expect(renderedPosts[0].caption).toBe(caption);
            expect(renderedPosts[0].imageUrl).toBe(imageUrl);

            // Ensure the form was cleared for the next input
            expect(mockView.resetForm).toHaveBeenCalledTimes(1);
        });

        it('should show an error message if the image URL is missing', () => {
            const createHandler = mockView.bindCreate.mock.calls[0][0];
            createHandler('', 'A valid caption');

            // Verify that an error message is shown and the view is not updated
            expect(mockView.showMessage).toHaveBeenCalledWith('Add an image URL and a caption.');
            expect(mockView.clearMessage).not.toHaveBeenCalled();
            expect(mockView.render).toHaveBeenCalledTimes(1); // Only called once during init
            expect(mockView.resetForm).not.toHaveBeenCalled();
        });

        it('should show an error message if the caption is missing', () => {
            const createHandler = mockView.bindCreate.mock.calls[0][0];
            createHandler('http://example.com/image.png', '');

            // Verify that an error message is shown and the view is not updated
            expect(mockView.showMessage).toHaveBeenCalledWith('Add an image URL and a caption.');
            expect(mockView.clearMessage).not.toHaveBeenCalled();
            expect(mockView.render).toHaveBeenCalledTimes(1); // Only called once during init
            expect(mockView.resetForm).not.toHaveBeenCalled();
        });
    });

    // Test suite for the handleReact() method
    describe('handleReact', () => {
        beforeEach(() => {
            // Initialize the controller to bind the handler and seed data
            controller.init();
        });

        it('should add a reaction to the correct post and re-render the view', () => {
            // The seeded posts have IDs 1 and 2. Let's react to post with ID 1.
            const postIdToReact = 1;
            const initialLikes = (mockView.render.mock.calls[0][0] as Post[]).find(p => p.id === postIdToReact)!.reactions.like;

            // Manually call the handler, simulating a view event
            const reactHandler = mockView.bindReact.mock.calls[0][0];
            reactHandler(postIdToReact, 'like');

            // Check that the view was rendered again
            expect(mockView.render).toHaveBeenCalledTimes(2);

            // Verify that the 'like' count on the post has increased by 1
            const updatedPosts = mockView.render.mock.calls[1][0] as Post[];
            const reactedPost = updatedPosts.find(p => p.id === postIdToReact);
            expect(reactedPost?.reactions.like).toBe(initialLikes + 1);
        });

        it('should do nothing if the post ID does not exist', () => {
            const reactHandler = mockView.bindReact.mock.calls[0][0];
            reactHandler(999, 'wow'); // 999 is a non-existent post ID

            // The view should not be re-rendered because no post was found or changed
            expect(mockView.render).toHaveBeenCalledTimes(1); // Only the initial render from init
        });
    });
});
