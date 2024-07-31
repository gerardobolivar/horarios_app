// Sample file
// Files under .server module are server-only code (Remix context)
// actions,loaders and headers in routes are server-only code too. 
export const serverProcess = (text:string)=>{
  console.log(`Hello from server your string is: ${text.toUpperCase()}`)
  return text.toUpperCase();
}