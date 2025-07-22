import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Bot, Database, Send, User } from 'lucide-react';
import moment, { Moment } from 'moment';
import { useEffect, useRef, useState } from 'react';

interface Message {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp: Moment;
}

interface ChatInterfaceProps {
	onSchemaGenerated: (schema: string, erd: string, queries: string[]) => void;
}

export const ChatInterface = ({ onSchemaGenerated }: ChatInterfaceProps) => {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: '1',
			role: 'assistant',
			content:
				"Hi! I'm Schema Pilot, your AI database architect. Describe your project and I'll generate an optimized database schema with queries and ERD visualization. What kind of application are you building?",
			timestamp: moment(),
		},
	]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const generateSchema = (userMessage: string) => {
		// Simulate AI schema generation based on user input
		const schemas = {
			ecommerce: {
				sql: `-- E-commerce Database Schema
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    category_id INTEGER REFERENCES categories(id),
    sku VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);`,
				erd: `erDiagram
    users {
        int id PK
        string email UK
        string password_hash
        string first_name
        string last_name
        timestamp created_at
        timestamp updated_at
    }
    
    categories {
        int id PK
        string name
        text description
        int parent_id FK
        timestamp created_at
    }
    
    products {
        int id PK
        string name
        text description
        decimal price
        int stock_quantity
        int category_id FK
        string sku UK
        timestamp created_at
        timestamp updated_at
    }
    
    orders {
        int id PK
        int user_id FK
        decimal total_amount
        string status
        timestamp created_at
        timestamp updated_at
    }
    
    order_items {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal price
    }
    
    users ||--o{ orders : "places"
    categories ||--o{ products : "contains"
    categories ||--o{ categories : "parent_of"
    orders ||--o{ order_items : "contains"
    products ||--o{ order_items : "ordered_in"`,
				queries: [
					'-- Get all products in a category with stock\nSELECT p.*, c.name as category_name\nFROM products p\nJOIN categories c ON p.category_id = c.id\nWHERE p.stock_quantity > 0\nORDER BY p.name;',
					"-- Get user's recent orders\nSELECT o.*, u.email, u.first_name, u.last_name\nFROM orders o\nJOIN users u ON o.user_id = u.id\nWHERE o.created_at >= NOW() - INTERVAL '30 days'\nORDER BY o.created_at DESC;",
					"-- Top selling products\nSELECT p.name, p.price, SUM(oi.quantity) as total_sold\nFROM products p\nJOIN order_items oi ON p.id = oi.product_id\nJOIN orders o ON oi.order_id = o.id\nWHERE o.status = 'completed'\nGROUP BY p.id, p.name, p.price\nORDER BY total_sold DESC\nLIMIT 10;",
				],
			},
			blog: {
				sql: `-- Blog Management System Schema
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'author',
    bio TEXT,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE post_tags (
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_comments_post ON comments(post_id);`,
				erd: `erDiagram
    users {
        int id PK
        string username UK
        string email UK
        string password_hash
        string role
        text bio
        string avatar_url
        timestamp created_at
    }
    
    posts {
        int id PK
        string title
        string slug UK
        text content
        text excerpt
        int author_id FK
        string status
        timestamp published_at
        timestamp created_at
        timestamp updated_at
    }
    
    tags {
        int id PK
        string name UK
        string slug UK
        text description
    }
    
    post_tags {
        int post_id FK
        int tag_id FK
    }
    
    comments {
        int id PK
        int post_id FK
        string author_name
        string author_email
        text content
        string status
        timestamp created_at
    }
    
    users ||--o{ posts : "writes"
    posts ||--o{ comments : "has"
    posts ||--o{ post_tags : "tagged_with"
    tags ||--o{ post_tags : "applied_to"`,
				queries: [
					"-- Get published posts with author info\nSELECT p.*, u.username, u.avatar_url\nFROM posts p\nJOIN users u ON p.author_id = u.id\nWHERE p.status = 'published'\nORDER BY p.published_at DESC;",
					"-- Get posts by tag\nSELECT p.title, p.slug, p.excerpt, t.name as tag_name\nFROM posts p\nJOIN post_tags pt ON p.id = pt.post_id\nJOIN tags t ON pt.tag_id = t.id\nWHERE t.slug = 'technology'\nAND p.status = 'published';",
					"-- Get comment count per post\nSELECT p.title, COUNT(c.id) as comment_count\nFROM posts p\nLEFT JOIN comments c ON p.id = c.post_id AND c.status = 'approved'\nWHERE p.status = 'published'\nGROUP BY p.id, p.title\nORDER BY comment_count DESC;",
				],
			},
		};

		// Simple keyword matching to determine schema type
		const message = userMessage.toLowerCase();
		if (
			message.includes('ecommerce') ||
			message.includes('shop') ||
			message.includes('product') ||
			message.includes('order')
		) {
			return schemas.ecommerce;
		} else if (
			message.includes('blog') ||
			message.includes('post') ||
			message.includes('article') ||
			message.includes('comment')
		) {
			return schemas.blog;
		} else {
			return schemas.ecommerce; // Default
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim() || isLoading) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			role: 'user',
			content: input,
			timestamp: moment(),
		};

		setMessages(prev => [...prev, userMessage]);
		setInput('');
		setIsLoading(true);

		// Simulate AI processing delay
		setTimeout(() => {
			const schema = generateSchema(input);
			onSchemaGenerated(schema.sql, schema.erd, schema.queries);

			const aiResponse: Message = {
				id: (Date.now() + 1).toString(),
				role: 'assistant',
				content: `I've generated an optimized database schema for your project! The schema includes proper relationships, indexes for performance, and follows best practices. Check out the Schema and ERD tabs to see the results. I've also generated some useful queries to get you started.

Key features of this schema:
- Normalized structure with proper foreign keys
- Performance indexes on frequently queried columns
- Timestamps for audit trails
- Appropriate data types and constraints

Would you like me to explain any part of the schema or generate additional queries?`,
				timestamp: moment(),
			};

			setMessages(prev => [...prev, aiResponse]);
			setIsLoading(false);
		}, 1500);
	};

	return (
		<div className='h-full flex flex-col bg-gradient-background overflow-hidden'>
			{/* Header */}
			<div className='p-4 border-b border-border bg-card/50 backdrop-blur-sm'>
				<div className='flex items-center gap-3'>
					<div className='w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow'>
						<Database className='w-5 h-5 text-primary-foreground' />
					</div>
					<div>
						<h1 className='text-xl font-bold bg-gradient-primary bg-clip-text text-transparent'>
							Schema Pilot
						</h1>
						<p className='text-sm text-muted-foreground'>
							AI Database Architect
						</p>
					</div>
				</div>
			</div>

			{/* Messages */}
			<div className='flex-1 overflow-y-auto scrollbar p-4 space-y-4'>
				<p className='text-center text-muted-foreground'>
					{moment(messages[messages.length - 1]?.timestamp).calendar(
						null,
						{
							lastDay: '[Yesterday]',
							sameDay: '[Today]',
							nextDay: '[Tomorrow]',
							sameElse: () => `DD MMMM`,
							lastWeek: () => `DD MMMM`,
						}
					)}
				</p>
				{messages.map(message => (
					<div
						key={message.id}
						className={cn(
							'flex gap-3 animate-slide-up',
							message.role === 'user'
								? 'justify-end'
								: 'justify-start'
						)}
					>
						{message.role === 'assistant' && (
							<div className='w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0'>
								<Bot className='w-4 h-4 text-primary' />
							</div>
						)}

						<Card
							className={cn(
								'max-w-[80%] p-4 transition-smooth',
								message.role === 'user'
									? 'bg-chat-user border-primary/20'
									: 'bg-chat-ai border-border'
							)}
						>
							<p className='text-sm leading-relaxed whitespace-pre-wrap'>
								{message.content}
							</p>
							<time className='text-xs text-muted-foreground mt-2 block'>
								{message.timestamp.format('hh:mm A')}
							</time>
						</Card>

						{message.role === 'user' && (
							<div className='w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0'>
								<User className='w-4 h-4 text-accent' />
							</div>
						)}
					</div>
				))}

				{isLoading && (
					<div className='flex gap-3 animate-slide-up'>
						<div className='w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center'>
							<Bot className='w-4 h-4 text-primary animate-glow-pulse' />
						</div>
						<Card className='bg-chat-ai border-border p-4'>
							<div className='flex items-center gap-2'>
								<div className='w-2 h-2 bg-primary rounded-full animate-glow-pulse'></div>
								<div
									className='w-2 h-2 bg-primary rounded-full animate-glow-pulse'
									style={{ animationDelay: '0.2s' }}
								></div>
								<div
									className='w-2 h-2 bg-primary rounded-full animate-glow-pulse'
									style={{ animationDelay: '0.4s' }}
								></div>
								<span className='text-sm text-muted-foreground ml-2'>
									Generating schema...
								</span>
							</div>
						</Card>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			{/* Input */}
			<div className='p-4 border-t border-border bg-card/50 backdrop-blur-sm'>
				<form onSubmit={handleSubmit} className='flex gap-2'>
					<Input
						value={input}
						onChange={e => setInput(e.target.value)}
						placeholder='Describe your database requirements...'
						className='flex-1 bg-input border-border focus:border-primary transition-smooth'
						disabled={isLoading}
					/>
					<Button
						type='submit'
						disabled={!input.trim() || isLoading}
						className='bg-gradient-primary hover:bg-gradient-secondary transition-smooth shadow-glow'
					>
						<Send className='w-4 h-4' />
					</Button>
				</form>
			</div>
		</div>
	);
};
