const butReq = document.getElementById('butRequest');
butReq.addEventListener('click', getContacts);
const cbMultiple = document.getElementById('multiple');
const cbName = document.getElementById('name');
const cbEmail = document.getElementById('email');
const cbTel = document.getElementById('tel');
const cbAddress = document.getElementById('address');
const cbIcon = document.getElementById('icon');
const ulResults = document.getElementById('results');
const supported = ('contacts' in navigator && 'ContactsManager' in window);
if (supported) {
  document.getElementById('notSupported').classList.add('hidden');
  butReq.removeAttribute('disabled');
}
async function getContacts() {
  const props = [];
  if (cbName.checked) props.push('name');
  if (cbEmail.checked) props.push('email');
  if (cbTel.checked) props.push('tel');
  if (cbAddress.checked) props.push('address');
  if (cbIcon.checked) props.push('icon');
  const opts = {multiple: cbMultiple.checked};
  try {
    const contacts = await navigator.contacts.select(props, opts);
    handleResults(contacts);
  } catch (ex) {
    ulResults.classList.add('error');
    ulResults.innerText = ex.toString();
  }
}
function handleResults(contacts) {
  ulResults.innerHTML = '';
  ulResults.classList.add('success');
  ulResults.classList.remove('error');
  contacts.forEach((contact) => {
    const lines = [];
    if (contact.name) lines.push(`<b>Name:</b> ${contact.name.join(', ')}`);
    if (contact.email) lines.push(`<b>E-mail:</b> ${contact.email.join(', ')}`);
    if (contact.tel) lines.push(`<b>Telephone:</b> ${contact.tel.join(', ')}`);
    if (contact.address) {
      contact.address.forEach((addr) => {
        const addrStr = [
          addr.addressLine?.join(' '),
          addr.city,
          addr.region,
          addr.postalCode,
          addr.country
        ].filter(Boolean).join(', ');
        lines.push(`<b>Address:</b> ${addrStr}`);
      });
    }
    if (contact.icon) {
      contact.icon.forEach((blob) => {
        const url = URL.createObjectURL(blob);
        lines.push(`<b>Icon:</b> <img src="${url}" class="contact-icon">`);
      });
    }
    const li = document.createElement('li');
    li.innerHTML = lines.join('<br>');
    ulResults.appendChild(li);
  });
}
