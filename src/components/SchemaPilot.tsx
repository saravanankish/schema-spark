import { useState } from 'react';
import { ChatInterface } from './ChatInterface';
import { SchemaDisplay } from './SchemaDisplay';
import { ThreadSidebar, Thread } from './ThreadSidebar';
import {
	ResizablePanelGroup,
	ResizableHandle,
	ResizablePanel,
} from './ui/resizable';
import { SidebarProvider } from './ui/sidebar';
import moment from 'moment';

interface Message {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp: moment.Moment;
}

export const SchemaPilot = () => {
	const [schema, setSchema] = useState('');
	const [erd, setErd] = useState('');
	const [queries, setQueries] = useState<string[]>([]);
	const [showErd, setShowErd] = useState(true);
	const [showQueries, setShowQueries] = useState(true);

	// Thread management
	const [threads, setThreads] = useState<Thread[]>([
		{
			id: '1',
			title: 'New Conversation',
		},
	]);
	const [activeThreadId, setActiveThreadId] = useState('1');
	const [threadMessages, setThreadMessages] = useState<
		Record<string, Message[]>
	>({
		'1': [
			{
				id: '1',
				role: 'assistant',
				content:
					"Hi! I'm Schema Pilot, your AI database architect. Describe your project and I'll generate an optimized database schema with queries and ERD visualization. What kind of application are you building?",
				timestamp: moment(),
			},
		],
	});

	const handleSchemaGenerated = (
		newSchema: string,
		newErd: string,
		newQueries: string[],
		erdEnabled: boolean,
		queriesEnabled: boolean
	) => {
		setSchema(newSchema);
		setErd(newErd);
		setQueries(newQueries);
		setShowErd(erdEnabled);
		setShowQueries(queriesEnabled);
	};

	const handleRenameThread = (id: string, title: string) => {
		if (id && title) {
			setThreads(prev => {
				const index = prev.findIndex(thread => thread.id === id);
				const updated = prev;
				updated[index].title = title;
				return [...updated];
			});
		}
	};

	const handleNewThread = () => {
		const newThread: Thread = {
			id: Date.now().toString(),
			title: 'New Conversation',
		};

		setThreads(prev => [newThread, ...prev]);
		setActiveThreadId(newThread.id);
		setThreadMessages(prev => ({
			...prev,
			[newThread.id]: [
				{
					id: Date.now().toString(),
					role: 'assistant',
					content:
						"Hi! I'm Schema Pilot, your AI database architect. Describe your project and I'll generate an optimized database schema with queries and ERD visualization. What kind of application are you building?",
					timestamp: moment(),
				},
			],
		}));

		// Reset schema display for new thread
		setSchema('');
		setErd('');
		setQueries([]);
	};

	const handleThreadSelect = (threadId: string) => {
		setActiveThreadId(threadId);
		// Reset schema display when switching threads
		setSchema('');
		setErd('');
		setQueries([]);
	};

	const handleDeleteThread = (threadId: string) => {
		if (threads.length <= 1) return; // Don't delete the last thread

		setThreads(prev => prev.filter(t => t.id !== threadId));
		setThreadMessages(prev => {
			const newMessages = { ...prev };
			delete newMessages[threadId];
			return newMessages;
		});

		// If deleting active thread, switch to first available thread
		if (activeThreadId === threadId) {
			const remainingThreads = threads.filter(t => t.id !== threadId);
			if (remainingThreads.length > 0) {
				setActiveThreadId(remainingThreads[0].id);
			}
		}
	};

	const updateThreadMessages = (messages: Message[]) => {
		setThreadMessages(prev => ({
			...prev,
			[activeThreadId]: messages,
		}));
	};

	const currentMessages = threadMessages[activeThreadId] || [];

	return (
		<SidebarProvider defaultOpen={false}>
			<div className='h-screen bg-gradient-background overflow-hidden w-full'>
				<div className='h-full flex w-full'>
					{/* Thread Sidebar */}
					<ThreadSidebar
						threads={threads}
						activeThreadId={activeThreadId}
						onThreadSelect={handleThreadSelect}
						onNewThread={handleNewThread}
						onDeleteThread={handleDeleteThread}
            onThreadRename={handleRenameThread}
					/>

					{/* Main Content */}
					<div className='flex-1 h-full'>
						<ResizablePanelGroup
							direction='horizontal'
							className='w-full h-full'
						>
							<ResizablePanel
								defaultSize={45}
								minSize={25}
								maxSize={60}
								className='border-r border-border h-full overflow-hidden'
							>
								<ChatInterface
									onSchemaGenerated={handleSchemaGenerated}
									messages={currentMessages}
									setMessages={updateThreadMessages}
								/>
							</ResizablePanel>
							<ResizableHandle />
							<ResizablePanel className='hidden lg:block h-full overflow-hidden'>
								<SchemaDisplay
									schema={schema}
									erd={erd}
									queries={queries}
									showErd={showErd}
									showQueries={showQueries}
								/>
							</ResizablePanel>
						</ResizablePanelGroup>
					</div>
				</div>
			</div>

			{/* Mobile Schema Display */}
			<div className='lg:hidden'>
				{schema && (
					<div className='fixed inset-0 bg-background z-50 p-4'>
						<div className='h-full flex flex-col'>
							<div className='flex items-center justify-between mb-4'>
								<h2 className='text-lg font-semibold'>
									Generated Schema
								</h2>
								<button
									onClick={() => setSchema('')}
									className='p-2 hover:bg-muted rounded-md'
								>
									✕
								</button>
							</div>
							<div className='flex-1 overflow-hidden'>
								<SchemaDisplay
									schema={schema}
									erd={erd}
									queries={queries}
									showErd={showErd}
									showQueries={showQueries}
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		</SidebarProvider>
	);
};
