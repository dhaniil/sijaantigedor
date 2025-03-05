-- Create songfests table
create table public.songfests (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    sender text not null,
    receiver text not null,
    message text not null,
    track_id text not null
);

-- Enable Row Level Security
alter table public.songfests enable row level security;

-- Create policy for viewing songfests (anyone can view)
create policy "Songfests are viewable by everyone"
    on public.songfests
    for select
    using (true);

-- Create policy for inserting songfests (authenticated users only)
create policy "Users can create songfests"
    on public.songfests
    for insert
    with check (auth.uid() = user_id);

-- Create policy for updating own songfests
create policy "Users can update their own songfests"
    on public.songfests
    for update
    using (auth.uid() = user_id);

-- Create policy for deleting own songfests
create policy "Users can delete their own songfests"
    on public.songfests
    for delete
    using (auth.uid() = user_id);

-- Create index for faster queries
create index songfests_user_id_idx on public.songfests(user_id);
create index songfests_created_at_idx on public.songfests(created_at desc);
