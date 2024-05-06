import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { Input } from "../components/ui/input"
import { useAuth } from "../hooks/useAuth";
import axios from 'axios';
import { url } from "../lib/utils";
import { useEffect, useState, useRef } from "react";

// const files = [
//   {
//     name: "asd.asd",
//   },
//   {
//     name: "asd.asd",
//   },
//   {
//     name: "asd.asd",
//   },
// ]

export function Home() {
  const { logout, setUser, user } = useAuth();
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);


  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };



  async function readFiles() {
    try {
      console.log(user)
      const header = {'Access-Control-Allow-Origin': '*'}
      if (user['CL-X-REFRESH']!=undefined){
        header['CL-X-TOKEN'] = user['CL-X-TOKEN']
        header['CL-X-REFRESH']= user['CL-X-REFRESH']
      }else if(user['cl-x-refresh']!=undefined){
        header['cl-x-token']= user['cl-x-token']
        header['cl-x-refresh']= user['cl-x-refresh']
      }
      const response = await axios.post(`${url}/account/readAccount`, {}, {
        headers: header, withCredentials: true
      });

      if (response.status !== 200) {
        throw new Error(`Failed to create: ${response.statusText}`);
      }
      if (response.headers['CL-X-REFRESH'] !== undefined) {
        setUser({ 'CL-X-TOKEN': response.headers['CL-X-TOKEN'], 'CL-X-REFRESH': response.headers['CL-X-REFRESH'] })
      }else if(response.headers['cl-x-refresh']!==undefined){
        setUser({'cl-x-token': response.headers['cl-x-token'], 'cl-x-refresh': response.headers['cl-x-refresh'] })
      }
      setFiles(response.data.result.files)
      console.log(response.data.result.files)
    } catch (error) {
      console.error('Create account error:', error);
    }
  }

  useEffect(() => {
    readFiles()
  }, [user])


  async function handleUploadButtonClick() {
    try {
      if (file==null){
        return
      }
      console.log(user)

      let data = new FormData();
      data.append('file', file);

      const header = {'Access-Control-Allow-Origin': '*','Content-Type': 'multipart/form-data'}
      if (user['CL-X-REFRESH']!=undefined){
        header['CL-X-TOKEN'] = user['CL-X-TOKEN']
        header['CL-X-REFRESH']= user['CL-X-REFRESH']
      }else if(user['cl-x-refresh']!=undefined){
        header['cl-x-token']= user['cl-x-token']
        header['cl-x-refresh']= user['cl-x-refresh']
      }

      const response = await axios.post(`${url}/file/uploadFile`, data, {
        headers: header, withCredentials: true
      });

      if (response.status !== 200) {
        throw new Error(`Failed to create: ${response.statusText}`);
      }
      if (response.headers['CL-X-REFRESH'] !== undefined) {
        setUser({ 'CL-X-TOKEN': response.headers['CL-X-TOKEN'], 'CL-X-REFRESH': response.headers['CL-X-REFRESH'] })
      }else if(response.headers['cl-x-refresh']!==undefined){
        setUser({'cl-x-token': response.headers['cl-x-token'], 'cl-x-refresh': response.headers['cl-x-refresh'] })
      }
      readFiles()
      console.log(response.data);
    } catch (error) {
      console.error('Create account error:', error);
    }
  }

  async function handleDeleteButtonClick(id) {
    try {
      console.log(user)

      const body = {
        id: id
      }

      const header = {'Access-Control-Allow-Origin': '*','Content-Type': 'application/x-www-form-urlencoded'}
      if (user['CL-X-REFRESH']!=undefined){
        header['CL-X-TOKEN'] = user['CL-X-TOKEN']
        header['CL-X-REFRESH']= user['CL-X-REFRESH']
      }else if(user['cl-x-refresh']!=undefined){
        header['cl-x-token']= user['cl-x-token']
        header['cl-x-refresh']= user['cl-x-refresh']
      }

      const response = await axios.post(`${url}/file/deleteFile`, body, {
        headers: header, withCredentials: true
      });

      if (response.status !== 200) {
        throw new Error(`Failed to create: ${response.statusText}`);
      }
      if (response.headers['CL-X-REFRESH'] !== undefined) {
        setUser({ 'CL-X-TOKEN': response.headers['CL-X-TOKEN'], 'CL-X-REFRESH': response.headers['CL-X-REFRESH'] })
      }else if(response.headers['cl-x-refresh']!==undefined){
        setUser({'cl-x-token': response.headers['cl-x-token'], 'cl-x-refresh': response.headers['cl-x-refresh'] })
      }
      readFiles()
      console.log(response.data);
    } catch (error) {
      console.error('Create account error:', error);
    }
  }

  return (
    <div className="flex h-screen w-full justify-center items-center">
      <Card>
        <div className="flex row gap-32 pb-20">
          <div className="flex gap-4">
            <Input ref={fileInputRef} type="file" onChange={handleFileChange} />
            <Button onClick={handleUploadButtonClick}>Upload</Button>
          </div>
          <Button variant="destructive" onClick={logout}>Log OUT</Button>
        </div>
        <Table>
          <TableCaption>List of your files.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">FileName</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{file.name}</TableCell>
                <TableCell className="text-right"><Button variant="destructive" onClick={() => handleDeleteButtonClick(file.id)}>Delete</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
