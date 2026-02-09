package com.library.controller;

import com.library.exception.UserException;
import com.library.mapper.UserMapper;
import com.library.model.User;


import com.library.payload.dto.UserDTO;
import com.library.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	

	
	@GetMapping("/api/users/profile")
	public ResponseEntity<UserDTO> getUserProfileFromJwtHandler(
			@RequestHeader("Authorization") String jwt) throws UserException {
		User user = userService.getUserFromJwtToken(jwt);
		UserDTO userDTO=UserMapper.toDTO(user);

		return new ResponseEntity<>(userDTO,HttpStatus.OK);
	}



	@GetMapping("/users/list")
	public ResponseEntity<List<User>> getUsersListHandler() throws UserException {
		List<User> users = userService.getUsers();

		return new ResponseEntity<>(users,HttpStatus.OK);
	}

	@GetMapping("/users/{userId}")
	public ResponseEntity<UserDTO> getUserByIdHandler(
			@PathVariable Long userId
	) throws UserException {
		User user = userService.getUserById(userId);
		UserDTO userDTO=UserMapper.toDTO(user);

		return new ResponseEntity<>(userDTO,HttpStatus.OK);
	}

	/**
	 * Get total user statistics (Admin only)
	 * GET /api/users/statistics
	 *
	 * Returns total number of registered users in the system
	 *
	 * Example response:
	 * {
	 *   "totalUsers": 245
	 * }
	 */
	@GetMapping("/api/users/statistics")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<UserStatisticsResponse> getUserStatistics() {
		long totalUsers = userService.getTotalUserCount();
		return ResponseEntity.ok(new UserStatisticsResponse(totalUsers));
	}

	/**
	 * Response DTO for user statistics endpoint
	 */
	public static class UserStatisticsResponse {
		public long totalUsers;

		public UserStatisticsResponse(long totalUsers) {
			this.totalUsers = totalUsers;
		}
	}

}
