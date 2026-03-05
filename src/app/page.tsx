import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth.api.getSession();

  if(session){
    redirect("/dashboard");
  }
  return (
    <div style={{ padding: "3rem", textAlign: "center"}}>
      <h1>Welcome to TaskFlow</h1>
      <p>
        A simple to-do app where you can create and manage your tasks.
      </p>
      <div style={{ marginTop: "2rem" }}>
        <a href="/login">Login</a> |{" "}
        <a href="/signup">Sign Up</a>
      </div>
    </div>
  );
}
// "use client";
// import { Box, TextField, Button, Grid } from '@mui/material';
// import { useState, useEffect} from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox} from '@mui/material';

// export default function Home() {
//   type Task = {
//     id: string;
//     title: string;
//     description: string | null;
//     dueAt: string | null;
//     completed: boolean;
//   }

//   const [todos, setTodos] = useState<Task[]>([]);
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [dueAt, setDueAt] = useState('');
//   const [completed, setCompleted] = useState(false);


//   // useEffect(() => {
//   //   fetch("/api/tasks")
//   //     .then((res) => res.json())
//   //     .then((data) => setTodos(data));
//   // }, []);

//   const handleAdd = async () => {
//     if (!title) return;
//     const res = await fetch("/api/tasks", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ 
//         title,
//         description, 
//         dueAt: dueAt || null,
//         completed,
//        }),
//       });

//     const newTask = await res.json();

//     setTodos(prev=>[...prev, newTask]);
//     setTitle('');
//     setDescription('');
//     setDueAt('');
//     setCompleted(false);
//   };

//   const handleDel = (index: number) => {
//     setTodos((prev) => prev.filter((_, i) => i !== index));
//   };
//   return (
//     <Box>
//       <Grid
//         container
//         spacing={2}>
//         <Grid size={3}>
//           <TextField
//             label="Title"
//             variant="outlined"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             fullWidth
//           />
//         </Grid>

//         <Grid size={3}>
//           <TextField
//             label="Description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             fullWidth
//             />
//         </Grid>

//         <Grid size={2}><TextField
//           type="date"
//           value={dueAt}
//           onChange={(e) => setDueAt(e.target.value)}
//           fullWidth
//         />
//         </Grid>

//         <Grid>
//           <Checkbox 
//             checked={completed}
//             onChange={(e) => setCompleted(e.target.checked)}/>
//         </Grid>
//         <Grid 
//           size={2}>
//           <Button 
//             variant='contained'
//             fullWidth
//             sx={{
//               height: '100%',
//             }} 
//             onClick={handleAdd}>
//             Add Task</Button>
//         </Grid>
//         <Grid
//         size={12}>
//           <Grid size={12}>
//             <TableContainer component={Paper}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Title</TableCell>
//                     <TableCell>Description</TableCell>
//                     <TableCell>Due Date</TableCell>
//                     <TableCell>Completed</TableCell>
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {todos.map((task) => (
//                   <TableRow key={task.id}>
//                     <TableCell>{task.title}</TableCell>
//                     <TableCell>{task.description || "-"}</TableCell>
//                     <TableCell>
//                       {task.dueAt
//                         ? new Date(task.dueAt).toLocaleDateString()
//                       : "-"}
//                     </TableCell>
//                     <TableCell>
//                       <Checkbox checked={task.completed} disabled />
//                     </TableCell>
//                   </TableRow> 
//                 ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Grid>
//         </Grid>
//         <Button
//         ></Button>
//       </Grid>
//     </Box>
//   );
// }
