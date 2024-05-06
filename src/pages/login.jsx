import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { formSchema } from "../schema/auth.schema";
import { useAuth } from "../hooks/useAuth";
import { url } from "../lib/utils";
import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import 'cross-fetch/polyfill';
const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

export function Login() {
  const { login } = useAuth();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });


  console.log("form.getValues(),", form.getValues());



  async function handleLoginButtonClick() {
    try {

      const requestBody = {
        email: form.getValues().email,
        password: form.getValues().password
      };

      const response = await axios.post(`${url}/account/loginAccount`, requestBody, {
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true
      })
      if (response.status !== 200) {
        throw new Error(`Failed to create: ${response.statusText}`);
      }
      console.log("login", login);
      if(response.headers['CL-X-REFRESH']!==undefined){
        login({'CL-X-TOKEN': response.headers['CL-X-TOKEN'], 'CL-X-REFRESH': response.headers['CL-X-REFRESH'] })
      }else if(response.headers['cl-x-refresh']!==undefined){
        login({'cl-x-token': response.headers['cl-x-token'], 'cl-x-refresh': response.headers['cl-x-refresh'] })
      }
      console.log(response.headers);
    } catch (error) {
      console.error('Create account error:', error);
    }
  }

  async function handleCreateButtonClick() {
    try {
      const requestBody = {
        email: form.getValues().email,
        password: form.getValues().password
      };

      const response = await client.post(`${url}/account/createAccount`, requestBody, {
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true
      });

      if (response.status !== 200) {
        throw new Error(`Failed to create: ${response.statusText}`);
      }

      console.log("login", login);
      
      if(response.headers['CL-X-REFRESH']!==undefined){
        login({'CL-X-TOKEN': response.headers['CL-X-TOKEN'], 'CL-X-REFRESH': response.headers['CL-X-REFRESH'] })
      }else if(response.headers['cl-x-refresh']!==undefined){
        login({'cl-x-token': response.headers['cl-x-token'], 'cl-x-refresh': response.headers['cl-x-refresh'] })
      }
      console.log(response);
    } catch (error) {
      console.error('Create account error:', error.response.data.message);
    }
  }

  return (
    <div className="flex h-screen w-full justify-center items-center">
      <Card className="p-8">
        <Form {...form}>
          <form className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex row gap-4">
              <Button type="button" onClick={handleLoginButtonClick}>
                Login
              </Button>
              <Button type="button" onClick={handleCreateButtonClick}>
                Create
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
