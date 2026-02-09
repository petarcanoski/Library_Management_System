package com.library.service;


import com.library.domain.UserRole;
import com.library.exception.UserException;
import com.library.model.User;

import java.util.List;
import java.util.Set;
//import com.library.payload.request.UpdateUserDto;


public interface UserService {
	User getUserByEmail(String email) throws UserException;
	User getUserFromJwtToken(String jwt) throws UserException;
	User getUserById(Long id) throws UserException;
	Set<User> getUserByRole(UserRole role) throws UserException;
	List<User> getUsers() throws UserException;
	User getCurrentUser() throws UserException;



	/**
	 * Get total count of all registered users (Admin only)
	 */
	long getTotalUserCount();
}
