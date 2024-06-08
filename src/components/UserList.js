import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = async (uid) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${uid}`);
      console.log('Selected User:', response.data);
      setSelectedUser(response.data[0]);
      const detailsResponse = await axios.get(`http://localhost:5000/user_details?uid=${uid}`);
      setUserDetails(detailsResponse.data);
      console.log('User Details:', detailsResponse.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleCloseDetail = () => {
    setSelectedUser(null); // Reset selectedUser to hide detailed view
    setUserDetails([]); // Clear user details
  };

  return (
    <div className="user-list-container">
      {!selectedUser && (
        <div className="inner">
          <h2>Users</h2>
          <table className="user-list">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.uid} onClick={() => handleUserClick(user.uid)}>
                  <td>{user.uid}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedUser && (
        <div className="user-details">
          <button className="close" onClick={handleCloseDetail}>Close</button>
          <h3>User Details</h3>
          {selectedUser ? (
            <>
              <p><strong>User ID:</strong> {selectedUser.uid}</p>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <table className="item-details">
                <thead>
                  <tr>
                    <th>Sl No</th>
                    <th>Item Name</th>
                    <th>Count</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {userDetails.map((item) => (
                    <tr key={item.serial_number}>
                      <td>{item.serial_number}</td>
                      <td>{item.item_name}</td>
                      <td>{item.count}</td>
                      <td>{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserList;
