// src/mockAuthService.js

const users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' },
    { username: 'user3', password: 'password3' },
  ];
  
  export const login = ({ username, password }) => {
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      return { success: true, message: 'Login successful' };
    } else {
      return { success: false, message: 'Invalid credentials' };
    }
  };
  
  export const register = ({ username, password }) => {
    const userExists = users.some((user) => user.username === username);
    if (userExists) {
      return { success: false, message: 'User already exists' };
    } else {
      users.push({ username, password });
      return { success: true, message: 'Registration successful' };
    }
  };
  