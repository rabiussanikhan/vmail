import { reactive } from 'vue';
import axios from 'axios';
import {Email, EmailActionCallback} from "../types/email";

let emails = reactive(new Set())

export const useEmailSelection = function(){
  let toggle = function(email:Email) {
    if(emails.has(email)) {
      emails.delete(email)
    } else {
      emails.add(email)
    }
  }
  let clear = () => {
    emails.clear()
  }
  let addMultiple = (newEmails:Email[]) => {
    newEmails.forEach((email:Email) => {
      emails.add(email)
    })
  }
  let forSelected = (fn:EmailActionCallback) => {
    emails.forEach((email) => {
      // @ts-ignore
      fn(email);
      // @ts-ignore
      axios.put(`http://localhost:3000/emails/${email.id}`, email).then(r => console.log(r))
    })
  }
  let markRead = () => forSelected(e => e.read = true)
  let markUnread = () => forSelected(e => e.read = false)
  let archive = () => { forSelected(e => e.archived = true); clear() }

  return {
    emails,
    toggle,
    clear,
    addMultiple,
    markRead,
    markUnread,
    archive
  }
}

export default useEmailSelection