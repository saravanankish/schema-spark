import { Button } from '@/components/ui/button';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
	useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Database,
	Edit,
	Edit2,
	MessageSquare,
	MoreHorizontal,
	Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

export interface Thread {
	id: string;
	title: string;
}

interface ThreadSidebarProps {
	threads: Thread[];
	activeThreadId: string;
	onThreadSelect: (threadId: string) => void;
	onNewThread: () => void;
	onDeleteThread: (threadId: string) => void;
	onThreadRename: (threadId: string, title: string) => void;
}

export const ThreadSidebar = ({
	threads,
	activeThreadId,
	onThreadSelect,
	onNewThread,
	onDeleteThread,
	onThreadRename,
}: ThreadSidebarProps) => {
	const truncateTitle = (title: string, maxLength = 30) => {
		return title.length > maxLength
			? title.substring(0, maxLength) + '...'
			: title;
	};
	const [renameThreadId, setRenameThreadId] = useState<string>(null);
	const [title, setTitle] = useState<string>('');

	const sideBar = useSidebar();

	return (
		<Sidebar
			collapsible='icon'
			className='border-r border-border bg-card/50 backdrop-blur-sm group-data-[state=collapsed]:cursor-e-resize'
			onClick={() => !sideBar.open && sideBar.setOpen(true)}
		>
			<SidebarHeader className='p-4 border-b border-border'>
				<div className='flex justify-between items-center mt-2'>
					<div className='w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow group-data-[state=collapsed]:group-hover:hidden'>
						<Database className='w-5 h-5 text-primary-foreground' />
					</div>
					<div className='group-data-[state=collapsed]:hidden group-data-[state=collapsed]:group-hover:block'>
						<SidebarTrigger className='w-10 h-10' />
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent className='p-4'>
				<SidebarMenu className='space-y-2'>
					<SidebarMenuItem>
						<SidebarMenuButton
							className='group-data-[state=collapsed]:ml-1'
							onClick={onNewThread}
							tooltip='New Thread'
						>
							<Edit className='mr-2' />
							New Thread
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarGroup className='group-data-[state=collapsed]:hidden p-0'>
						<SidebarGroupLabel>Chats</SidebarGroupLabel>
						<SidebarMenu>
							{threads.map(thread => (
								<SidebarMenuItem key={thread.id}>
									{thread.id === renameThreadId ? (
										<Input
											autoFocus
											id='title'
											value={title}
											onChange={e =>
												setTitle(e.target.value)
											}
											onBlur={() => {
												if (
													title &&
													title !== thread.title
												) {
													onThreadRename(
														thread.id,
														title.trim()
													);
												}
												setRenameThreadId(null);
												setTitle('');
											}}
											className='bg-input h-8 focus-visible:ring-sidebar-primary-foreground/20 rounded-sm'
										/>
									) : (
										<>
											<SidebarMenuButton
												onClick={() =>
													onThreadSelect(thread.id)
												}
												className={cn(
													activeThreadId ===
														thread.id &&
														'bg-sidebar-border/10'
												)}
											>
												{truncateTitle(thread.title)}
											</SidebarMenuButton>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<SidebarMenuAction>
														<MoreHorizontal />
													</SidebarMenuAction>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align='start'
													side='right'
												>
													<DropdownMenuItem
														className='focus:bg-sidebar-accent'
														onClick={e => {
															e.stopPropagation();
															setRenameThreadId(
																thread.id
															);
															setTitle(
																thread.title
															);
														}}
													>
														<Edit2
															size={16}
															className='mr-2'
														/>
														Rename
													</DropdownMenuItem>
													{threads.length > 1 && (
														<DropdownMenuItem
															className='text-red-600 focus:bg-red-600/20 focus:text-red-600'
															onClick={e => {
																e.stopPropagation();
																onDeleteThread(
																	thread.id
																);
															}}
														>
															<Trash2
																size={16}
																className='mr-2'
															/>
															Delete
														</DropdownMenuItem>
													)}
												</DropdownMenuContent>
											</DropdownMenu>
										</>
									)}
								</SidebarMenuItem>
							))}

							{threads.length === 0 && (
								<div className='text-center py-8'>
									<MessageSquare className='w-8 h-8 mx-auto text-muted-foreground mb-2' />
									<p className='text-sm text-muted-foreground'>
										No threads yet
									</p>
									<p className='text-xs text-muted-foreground'>
										Start a new conversation
									</p>
								</div>
							)}
						</SidebarMenu>
					</SidebarGroup>
				</SidebarMenu>
			</SidebarContent>
		</Sidebar>
	);
};
