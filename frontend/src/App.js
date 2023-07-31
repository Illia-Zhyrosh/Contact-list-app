
import { useState } from 'react';
import './App.css';
import logo from './logo.svg'
import axios from 'axios';
import { CiFloppyDisk, CiEdit, CiTrash, CiSearch, CiRedo } from 'react-icons/ci'
import { FaArrowCircleUp, FaArrowCircleDown, FaCircle, FaBars } from 'react-icons/fa';
function App() {
  const [menu, setMenu] = useState(false);

  const [contacts, setContacts] = useState([]);

  const [addContactState, setAddContactState] = useState(false);

  const [initialForm, setInitialForm] = useState(false);

  const [contactId, setContactId] = useState('');

  const [firstName, setFirstName] = useState('');

  const [lastName, setLastName] = useState('');

  const [email, setEmail] = useState('');

  const [phone, setPhone] = useState('');

  const [status, setStatus] = useState(false);

  const [editor, setEditor] = useState(false);

  const [filter, setFilter] = useState('');

  async function CheckConnection() {
    try {
      await axios.get("https://localhost:7296/api/ContactModels")
      setStatus(true);

    }
    catch {
      setStatus(false);
    }
  }
  CheckConnection();

  async function LoadData() {
    // Fetching contacts list from backend.
    var contactData;
    if (status) {
      try {
        contactData = await axios.get("https://localhost:7296/api/ContactModels");

      }
      catch {
        return;
      }

      setEditor(false);
      setAddContactState(false);


      var temp = contactData.data;
      if (temp.length < 1) {
        setInitialForm(true);
        return;
      }

      if (temp.length !== contacts.length) {
        setContacts(contactData.data);
      }
    }
    else {
      return;
    }

  }

  async function RemoveContact(id) {
    // Deleting contact by id.
    await axios.delete(`https://localhost:7296/api/ContactModels/${id}`);
    LoadData();
  }

  // eslint-disable-next-line
  async function EditContact(contact) {

    setEditor(true);
    setContactId(contact.id);
    setFirstName(contact.firstName);
    setLastName(contact.lastName);
    setEmail(contact.email);
    setPhone(contact.phoneNumber);
  }
  async function resetInputs() {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
  }
  async function PutContact(id) {
    // Editing contact by id
    var editedContact
    if (firstName.trim() && lastName.trim() && email.trim() && phone.trim()) {
      editedContact = {
        id: id,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phoneNumber: phone.trim()
      };
    }
    else {
      alert('Please fill out all of the fields!');

    }

    try {
      await axios.put(`https://localhost:7296/api/ContactModels/` + id, editedContact).then(async () => {
        var temp = contacts;
        temp = temp.filter(obj => {
          return obj.id !== id
        })

        temp.push(editedContact);
        setContacts(temp);
        resetInputs();
        setEditor(false)

      }).catch(err => {
        console.log(err);
      });



    }
    catch {
      console.log('Error');
    }
    await LoadData();



  }
  function mapTable(data) {
    if (data.length > 0) {
      return (
        data.map(contact => (
          <tr key={contact.id}>
            <td>{contact.firstName}</td>
            <td>{contact.lastName}</td>
            <td>{contact.email}</td>
            <td>{contact.phoneNumber}</td>
            <td><button className='editButton' onClick={() => { EditContact(contact); setAddContactState(false) }}><CiEdit /></button>
              <button className='removeButton' onClick={() => { RemoveContact(contact.id); setEditor(false); setAddContactState(false) }}><CiTrash /></button></td>
          </tr>

        ))

      )
    }
    else {
      return;
    }

  }
  function ContactTable() {
    const [sortConfig, setSortConfig] = useState({
      sortBy: null,
      direction: true
    });

    const sortTableData = () => {

      return contacts.sort((a, b) => {
        if (a[sortConfig.sortBy] < b[sortConfig.sortBy]) return sortConfig.direction ? 1 : -1;
        if (a[sortConfig.sortBy] > b[sortConfig.sortBy]) return sortConfig.direction ? -1 : 1;
        return 0;
      })

    }
    return (

      <>

        <table className='responsive-table'>
          <thead>
            <tr>
              <th>First Name
                <button className='sortButton' onClick={() =>
                  setSortConfig(
                    { ...sortConfig, sortBy: 'firstName', direction: true }
                  )}><FaArrowCircleUp />
                </button>
                <button className='sortButton' onClick={() =>
                  setSortConfig(
                    { ...sortConfig, sortBy: 'firstName', direction: false }
                  )}><FaArrowCircleDown />
                </button>
              </th>
              <th>Last Name
                <button className='sortButton' onClick={() =>
                  setSortConfig(
                    { ...sortConfig, sortBy: 'lastName', direction: true }
                  )}><FaArrowCircleUp />
                </button>
                <button className='sortButton' onClick={() =>
                  setSortConfig(
                    { ...sortConfig, sortBy: 'lastName', direction: false }
                  )}><FaArrowCircleDown />
                </button>
              </th>
              <th>Email
                <button className='sortButton' onClick={() =>
                  setSortConfig(
                    { ...sortConfig, sortBy: 'email', direction: true }
                  )}>
                  <FaArrowCircleUp />
                </button>
                <button className='sortButton' onClick={() =>
                  setSortConfig(
                    { ...sortConfig, sortBy: 'email', direction: false }
                  )}>
                  <FaArrowCircleDown />
                </button>
              </th>
              <th>Phone number
                <button className='sortButton' onClick={() =>
                  setSortConfig(
                    { ...sortConfig, sortBy: 'phoneNumber', direction: true }
                  )}>
                  <FaArrowCircleUp />
                </button>
                <button className='sortButton' onClick={() =>
                  setSortConfig(
                    { ...sortConfig, sortBy: 'phoneNumber', direction: false }
                  )}>
                  <FaArrowCircleDown />
                </button>
              </th>
              <th>

              </th>
            </tr>
          </thead>
          <tbody>
            {mapTable(sortTableData())}
          </tbody>
        </table>
      </>
    );
  }


 
  async function AddContact() {
    // Adding new contact to database

    if (firstName.trim() && lastName.trim() && email.trim() && phone.trim()) {
      try {
        var newContact = {
          id: Math.floor(Math.random() * 100000),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phoneNumber: phone.trim()
        }
        await axios.post("https://localhost:7296/api/ContactModels", newContact);

      }
      catch {
        newContact = {
          id: Math.floor(Math.random() * 100000 + 1),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phoneNumber: phone.trim()
        }
        await axios.post("https://localhost:7296/api/ContactModels", newContact);
      }

      resetInputs();
    }
    else {
      alert('Please fill out all of the fields!');
    }
    await LoadData();
  }

  function NoDataForm() {
    // If initial data base is empty prompt first entry creation
    return (
      <div className='addInitialContactWindow'>
        <p>The server is online, however no data was found. Would you like to create a first entry?</p>
        <div>
          <button className='yesButton' onClick={() => { setAddContactState(true); setInitialForm(false) }}>Yes</button>
          <button className='noButton' onClick={() => setInitialForm(false)}>No</button>
        </div>

      </div>
    )
  }
  const handleSearch = async (value) => {
    var searchResults = [];
    if (value.length === 0) {
      await LoadData();
    }
    else {


      var temp = contacts;


      for (var i = 0; i < temp.length; i++) {
        console.log(temp[i]);
        // eslint-disable-next-line
        var entry = Object.keys(temp[i]).map(key => (temp[i][key]).toString());
        console.log(entry)
        var filteredEntry = entry.filter(entry => entry.includes(value));

        if (filteredEntry.length > 0) {
          searchResults.push(temp[i]);
        }

      }

      if (searchResults.length > 0) {
        setContacts(searchResults);
      }
      else {
        LoadData();
      }

    }


  }
  return (
    <div className="App">
      <div className='navBar'>
        <button id='menuButton' onClick={() => setMenu(!menu)}> <FaBars size={'1.5rem'} fontWeight={'100'} /> Menu </button>

        

      </div>
      <div className='ContentHolder' >
        {menu ? (
          <div className='SideBarHolder'>

            <button className='sideButton' onClick={() => { LoadData(); setMenu(false) }}><CiFloppyDisk /> Load Data</button>
            <button className='sideButton' onClick={() => { setContacts([]); setMenu(false) }}><CiTrash /> Clear Data</button>

          </div>

        ) : (
          []
        )}
        {initialForm ? <NoDataForm /> : null}
        {



          contacts.length > 0 ? (<div className='ContactHolder'>
            <div className='searchBar'>

              <input type='search' value={filter} onChange={(e) => setFilter(e.currentTarget.value)}></input>
              <button className='sortButton' onClick={() => handleSearch(filter)}><CiSearch /></button>
              <button className='sortButton' onClick={() => LoadData()}><CiRedo /></button>
            </div>
            <ContactTable />

            <button className='addContactButton' onClick={() => { setAddContactState(!addContactState); setEditor(false) }}>Add Contact</button>
          </div>) : (null)


        }

      </div>
      {addContactState ? (

        <div className='contactFieldHolder'>
          <h4>Adding new contact: </h4>
          <div className='input-row'>

            <label>First name: </label>
            <input value={firstName} maxLength={20} id='firstName' onChange={(e) => setFirstName(e.currentTarget.value)}></input>
          </div>
          <div className='input-row'>
            <label>Last name: </label>
            <input value={lastName} maxLength={20} onChange={(e) => setLastName(e.currentTarget.value)} id='lastName'></input>
          </div >
          <div className='input-row'>
            <label>Email: </label>
            <input id='email' value={email} maxLength={30} onChange={(e) => setEmail(e.currentTarget.value)}></input>
          </div >
          <div className='input-row'>
            <label>Phone number: </label>
            <input id='phoneNumber' value={phone} maxLength={16} onChange={(e) => setPhone(e.currentTarget.value)}></input>
          </div >
          <div className='input-row'>
            <button className='yesButton' id='addContactButton' onClick={() => AddContact()}>Submit</button>
            <button className='noButton' id='cancelContactButton' onClick={() => setAddContactState(false)}>Cancel</button>
          </div>
        </div>) : (null)}
      <div className='editorHolder'>
        {editor ? <div className='contactFieldHolder'>
          <h4>Editing contact: {contactId} </h4>
          <div className='input-row'>
            <label>First name: </label>
            <input value={firstName} maxLength={20} id='firstNameEdit' onChange={(e) => setFirstName(e.currentTarget.value)}></input>
          </div>
          <div className='input-row'>
            <label>Last name: </label>
            <input value={lastName} maxLength={20} onChange={(e) => setLastName(e.currentTarget.value)} id='lastNameEdit'></input>
          </div >
          <div className='input-row'>
            <label>Email: </label>
            <input id='emailEdit' value={email} maxLength={30} onChange={(e) => setEmail(e.currentTarget.value)}></input>
          </div >
          <div className='input-row'>
            <label>Phone number: </label>
            <input id='phoneNumberEdit' value={phone} maxLength={16} onChange={(e) => setPhone(e.currentTarget.value)}></input>
          </div >
          <div className='input-row'>
            <button className='yesButton' id='editContactButton' onClick={() => { PutContact(contactId) }}>Submit</button>
            <button className='noButton' onClick={() => setEditor(false)}>Cancel</button>
          </div>
        </div> : null}
      </div>
      <footer>
        <div>
          <h6>Zhyrosh Illia  2023 - {new Date().getFullYear() + 1} </h6>
          <h6>
            <img className='icon' src={logo} alt='spinningLogo'></img>
          </h6>

          <h6 className='serverInfo'>Server status: {status ? (`online `) : (`offline `)}   </h6>
          {status ? <FaCircle color='green' size={'1.2rem'} className='statusOKIcon' /> : <FaCircle color='red' size={'1.2rem'} className='statusErrIcon' />}
        </div>
      </footer>
    </div>
  );
}

export default App;
