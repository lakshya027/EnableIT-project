import React, { useEffect, useState } from 'react';
import axios from 'axios';

export interface User {
  ID: string;
  JobTitle: string;
  EmailAddress: string;
  FirstNameLastName: string;
  Email: string;
  Phone: string;
  Company: string;
}

export interface Pagination {
  totalUsers: number;
  users: User[];
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [limit] = useState<number>(10);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<Pagination>(`https://give-me-users-forever.vercel.app/api/users/${page - 1}/next`, {
          params: { page, limit },
        });
        console.log('API Response:', response.data);
        setUsers(response.data.users);
        setTotalUsers(100);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    fetchUsers();
  }, [page, limit]);

  const totalPages = Math.ceil(totalUsers / limit);

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
  };

  return (
    <div className="user-table-container">
      <h1>Users Table</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Job Title</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.ID}>
              <td>{user.ID}</td>
              <td>{user.FirstNameLastName}</td>
              <td>{user.JobTitle}</td>
              <td>{user.Email}</td>
              <td>{user.Phone}</td>
              <td>{user.Company}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-controls">
        <button disabled={page === 0} onClick={() => handlePageClick(1)}>
          &laquo;
        </button>
        <button disabled={page === 1} onClick={() => handlePageClick(page - 1)}>
          &lsaquo;
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            className={page === pageNumber ? 'active' : ''}
            onClick={() => handlePageClick(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
        <button disabled={page === totalPages} onClick={() => handlePageClick(page + 1)}>
          &rsaquo;
        </button>
        <button disabled={page === totalPages} onClick={() => handlePageClick(totalPages)}>
          &raquo;
        </button>
      </div>
    </div>
  );
};

export default UserTable;
