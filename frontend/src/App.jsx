import { Navigate, Route ,Routes} from "react-router"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Homepage from "./pages/Homepage"
import { checkAuth } from "../authSlice"
import { useDispatch,useSelector } from "react-redux"
import { useEffect } from "react"
import ProblemPage from "./pages/ProblemPage"
import AdminPanel from "../src/components/AdminPanel"
import AdminDelete from "../src/components/AdminDelete"
import Admin from "./pages/Admin"
import AdminVideo from "./components/AdminVideo"
import AdminUpload from "./components/AdminUpload"

function App(){

  const {isAuthenticated,user,loading} = useSelector((state)=>state.auth)
  const dispatch = useDispatch();
  // console.log(user.role)
  useEffect(()=>{
    dispatch(checkAuth()); 
  },[dispatch])
  
  return(
    <>
    
    <Routes>
      <Route path="/" element={isAuthenticated?<Homepage></Homepage>:<Navigate to="/signup"/>}></Route>
      <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<Login></Login>}></Route>
      <Route path="/signup" element={isAuthenticated?<Navigate to="/" />:<Signup></Signup>}></Route>
  
      <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
      <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
      <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
      <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />} />
      <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
     
      <Route path="/problem/:problemId" element={<ProblemPage/>}></Route>

    </Routes>
    </>
  )
}

export default App