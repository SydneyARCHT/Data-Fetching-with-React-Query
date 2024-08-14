import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PostComponent from './components/PostComponent';
import UpdateDisplay from './components/UpdateComponent';


function App() {
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <h1>React Query CRUD Operations</h1>
        <PostComponent />
        <br />
        {/* <PostsDisplay /> */}
        <UpdateDisplay />
        
      </div>
    </QueryClientProvider>
  )
}

export default App