<template>
  <button @click="selectedScreen = 'inbox'"
          :disabled="selectedScreen === 'inbox'">Inbox</button>
  <button @click="selectedScreen = 'archive'"
          :disabled="selectedScreen === 'archive'">Archived</button>

  <BulkActionBar :emails="filteredEmails" />

  <table class="mail-table">
    <tbody>
      <tr v-for="email in filteredEmails"
          :key="email.id"
          :class="['clickable', email.read ? 'read' : '']">
        <td>
          <input type="checkbox"
                 @click="emailSelection.toggle(email)"
                 :checked="emailSelection.emails.has(email)" />
        </td>
        <td @click="openEmail(email)">{{email.from}}</td>
        <td @click="openEmail(email)">
          <p><strong>{{email.subject}}</strong> - {{email.body}}</p>
        </td>
        <td class="date" @click="openEmail(email)">
          {{format(new Date(email.sentAt), 'MMM do yyyy')}}
        </td>
        <td><button @click="archiveEmail(email)">Archive</button></td>
      </tr>
    </tbody>
  </table>

  <ModalView v-if="openedEmail" @closeModal="openedEmail = null">
    <MailView :email="openedEmail" @changeEmail="changeEmail" />
  </ModalView>
</template>

<script setup lang="ts">
  import { format } from 'date-fns';
  import axios from 'axios';
  import MailView from './MailView.vue';
  import ModalView from './ModalView.vue';
  import BulkActionBar from './BulkActionBar.vue';
  import {computed, reactive, ref} from 'vue';
  import useEmailSelection from "../composables/use-email-selection";
  import {ChangeEmailParamType, Email} from "../types/email";


  let {data} = await axios.get('http://localhost:3000/emails')
  const emails = ref<Email[]>(data)
  const openedEmail = ref<any>(null)
  const selectedScreen = ref<string>('inbox')
  const emailSelection = useEmailSelection()

  const sortedEmails = computed(() => {
      return emails.value.sort((e1:Email, e2:Email) => {
          return e1.sentAt < e2.sentAt ? 1 : -1
      })
  })

  const filteredEmails = computed(() => {
      if(selectedScreen.value == 'inbox') {
          return sortedEmails.value.filter(e => !e.archived)
      } else {
          return sortedEmails.value.filter(e => e.archived)
      }
  })

  const selectScreen = (newScreen:string):void => {
      selectedScreen.value = newScreen
      emailSelection.clear()
  }
  const openEmail = (email:Email) => {
      openedEmail.value = email

      if(email) {
          email.read = true
          updateEmail(email)
      }
  }
  const changeEmail = ({toggleRead, toggleArchive, save, closeModal, changeIndex}:ChangeEmailParamType) => {
      let email = openedEmail.value
      if(toggleRead) { email.read = !email.read }
      if(toggleArchive) { email.archived = !email.archived }
      if(save) { updateEmail(email) }
      if(closeModal) { openedEmail.value = null }

      if(changeIndex) {
          let emails = filteredEmails.value
          let currentIndex = emails.indexOf(openedEmail)
          let newEmail = emails[currentIndex + changeIndex]
          openEmail(newEmail)
      }
  }

  const archiveEmail = (email:Email) =>{
      email.archived = true
      updateEmail(email)
  }
  const updateEmail = (email:Email) => {
      axios.put(`http://localhost:3000/emails/${email.id}`, email)
  }

</script>
