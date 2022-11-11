import { ethers } from "ethers";
import { Card as BootStrapCard, InputGroup, FormControl } from "react-bootstrap";
import { CardActionArea, CardContent, CardActions, Typography, Card, Button, Box } from '@mui/material';
import { useState, useEffect } from "react";
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import FilterListIcon from '@mui/icons-material/FilterList';
import Todo from "./contracts/NoteApp.json";
import Header from "./components/Header";
import './App.css';

const contractAddress = "0x6b75fc9AafeBffeefdb51492ce7fBCe8B0EE093f";

function App() {
  const [task, addTask] = useState("");
  const [connection, setConnection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);

  const [author, addAuthor] = useState("");
  const [taskArray, updateTask] = useState([]);

  // Backend part

  // we will load the to do's on blockchain after the wallet is connected
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contractSigner = new ethers.Contract(contractAddress, Todo.abi, signer);
  const contractProvider = new ethers.Contract(contractAddress, Todo.abi, provider);

  const checkIfWalletIsConnected = () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
  }

  useEffect(() => {
    async function requestAccount() {
      let arr = [];

      checkIfWalletIsConnected();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractProvider = new ethers.Contract(contractAddress, Todo.abi, provider);

      // we try here to get the public key of the accounts
      await window.ethereum.request({
        method: "eth_requestAccounts"
      });

      setConnection(true);

      // below is the code for getting data from bc
      let taskArrayTxn = await contractProvider.getTasks();

      taskArrayTxn.forEach((element) => {
        if (element.author !== "")
          arr.push(element);
      })

      updateTask(arr.reverse());
    }

    requestAccount();
  }, []);

  useEffect(() => { console.log("click",taskArray); return; }, [taskArray]);

  async function getAllTask() {
    try {
      let reverseArr = [];
      let taskArrayTxn = await contractProvider.getTasks();

      taskArrayTxn.forEach((element) => {
        if (element.author !== "")
          reverseArr.push(element);
      })

      updateTask(reverseArr.reverse());
      console.log(taskArray)
    } catch (err) {
      console.log(err);
      alert("Transaction Reject due to error!!!")
    }
  }

  async function addNewTask() {
    try {
      setLoading(true);

      let addTaskTxn = await contractSigner.createTask(task, author);
      await addTaskTxn.wait();
      console.log("added task succesfully");

      setLoading(false);
      getAllTask();
    } catch (err) {
      console.log(err);
      setLoading(false);
      alert("Transaction Reject due to error!!!")
    }
  }

  async function toggleTask(taskId) {
    let id = parseInt(taskId);
    try {
      const toggleTxn = await contractSigner.setDoneTrue(id);
      await toggleTxn.wait();

      getAllTask();
    }
    catch (err) {
      console.log(err);
      alert("Transaction Reject due to error!!!")
    }
  }

  async function deleteTask(taskId) {
    let id = parseInt(taskId);
    try {
      const deleteTxn = await contractSigner.deleteTask(id);
      await deleteTxn.wait();

      getAllTask();
    }
    catch (err) {
      console.log(err);
      alert("Transaction Reject due to error!!!")
    }
  }

  const filterTodos = async (event) => {
    try {
      event.preventDefault();
      setFilterLoading(true);
      let array = taskArray;
      let filterdArray = await array.sort((a, b) => Number(a.done) - Number(b.done));
      // console.log(filterdArray);
      updateTask(filterdArray);
      setFilterLoading(false);
    } catch (err) {
      console.log(err);
      setFilterLoading(false);
    }
  }

  return (
    <div>
      <Header />

      <div className="form-group mx-auto" style={{ width: "39rem", padding: "15px" }}>

        <InputGroup size="sm" className="mb-3 mt-2">
          <InputGroup.Text id="inputGroup-sizing-sm">Title</InputGroup.Text>
          <FormControl
            onChange={(e) => addAuthor(e.target.value)}
          ></FormControl>
        </InputGroup>

        <label htmlFor="exampleFormControlTextarea1" className="my-2">Add Task</label>
        <textarea
          className="form-control width-10"
          id="exampleFormControlTextarea1"
          rows="5"
          onChange={(e) => addTask(e.target.value)}
          placeholder='Write here...'
        />

        <br />

        {connection && <Box sx={{ '& > button': { m: 0 } }} >
          <LoadingButton
            className="my-btn"
            sx={{ width: 220 }}
            onClick={addNewTask}
            endIcon={<SendIcon />}
            loading={loading}
            loadingPosition="end"
            variant="contained"
          >
            Add Note
          </LoadingButton>

          <LoadingButton
            className="my-btn"
            sx={{ width: 220 }}
            onClick={filterTodos}
            endIcon={<FilterListIcon />}
            loading={filterLoading}
            loadingPosition="end"
            variant="contained"
          >
            Filter Your Todo's
          </LoadingButton>
        </Box>}
      </div>

      <div id="errorBox" className="red d-flex justify-content-center mx-auto my-2"></div>

      <div>
        <BootStrapCard
          style={{ width: "39rem" }}
          className="d-flex justify-content-center align-item-center mx-auto my-2"
        >
          {
            taskArray.map((task, index) => {
              return (
                <>
                  <Card sx={{ p: 3 }} key={index}>
                    <CardActionArea>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {task.author}
                        </Typography>
                        <Typography component={'span'} variant="body2" color="text.secondary">
                          <p>{task.content}</p>
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      {
                        task.done ?
                          <Button variant="contained" color="success" onClick={() => toggleTask(task.taskid)}>Completed</Button> :
                          <Button variant="outlined" color="success" onClick={() => toggleTask(task.taskid)}>Incomplete</Button>
                      }
                      <Button variant="contained" color="error" onClick={() => deleteTask(task.taskid)}>Delete</Button>
                    </CardActions>
                  </Card>
                </>
              )
            })
          }
        </BootStrapCard>
      </div>
    </div >
  );
}

export default App;