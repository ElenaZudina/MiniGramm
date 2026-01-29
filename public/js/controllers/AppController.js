import { Post } from '../models/Post.js';
// Связывает Views и данные, управляет состоянием ленты
export class AppController {
    constructor(view) {
        this.view = view;
        this.posts = [];
        this.nextId = 1;
        // Обработчик создания нового поста
        this.handleCreatePost = (imageUrl, caption) => {
            if (!imageUrl || !caption) {
                this.view.showMessage('Add an image URL and a caption.');
                return;
            }
            this.view.clearMessage();
            const post = new Post(this.nextId++, imageUrl, caption);
            this.posts = [post, ...this.posts];
            this.view.render(this.posts);
            this.view.resetForm();
        };
        // Обработчик реакций: ищем пост и увеличваем соответствующий счетчик
        this.handleReact = (postId, reaction) => {
            const found = this.posts.find((post) => post.id === postId);
            if (!found)
                return;
            found.addReaction(reaction);
            this.view.render(this.posts);
        };
    }
    // Точка инициализации: подписываем события, наполняем демо-данными и показываем список
    init() {
        this.view.bindCreate(this.handleCreatePost);
        this.view.bindReact(this.handleReact);
        this.seed();
        this.view.render(this.posts);
    }
    // Добавляем несколько стартовых постов
    seed() {
        const demo = [
            new Post(this.nextId++, 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?q=80&w=1315&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', 'Sunset vibes', { like: 8, wow: 2, laugh: 1 }),
            new Post(this.nextId++, 'https://images.unsplash.com/photo-1705743244403-337b88a69b71?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fFdlZWtlbmQlMjBjb2ZmZSUyMGJyZWFrfGVufDB8fDB8fHww', 'Weekend coffe break', { like: 5, wow: 1, laugh: 0 })
        ];
        this.posts = demo;
    }
}
