package com.library.service.impl;

import com.library.configurations.JwtProvider;
import com.library.domain.UserRole;
import com.library.exception.UserException;
import com.library.mapper.UserMapper;
import com.library.model.PasswordResetToken;
import com.library.model.User;
import com.library.payload.dto.UserDTO;
import com.library.payload.response.AuthResponse;


import com.library.repository.PasswordResetTokenRepository;
import com.library.repository.UserRepository;
import com.library.service.AuthService;
import com.library.service.EmailService;
import com.library.service.WishlistService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final CustomUserImplementation customUserImplementation;
    private final WishlistService wishlistService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    @Value("${app.frontend.reset-url}")
    private String frontendResetUrl;


    @Override
    public AuthResponse signup(UserDTO req) throws UserException {

        User user = userRepository.findByEmail(req.getEmail());
        if(user != null) {
            throw new UserException("Email id already registered ");
        }

//        if(req.getRole().equals(UserRole.ROLE_ADMIN)){
//            throw new UserException("Role admin is not allowed");
//        }


        User createdUser = new User();
        createdUser.setEmail(req.getEmail());
        createdUser.setPassword(passwordEncoder.encode(req.getPassword()));
        createdUser.setPhone(req.getPhone());
        createdUser.setFullName(req.getFullName());
        createdUser.setLastLogin(LocalDateTime.now());
        createdUser.setCreatedAt(LocalDateTime.now());
        createdUser.setRole(UserRole.ROLE_USER);


        User savedUser = userRepository.save(createdUser);
//        UserDTO userDTO=new UserDTO();
//        userDTO.setEmail(savedUser.getEmail());
//        userDTO.setFullName(savedUser.getFullName());
//        userDTO.setId(savedUser.getId());

//        userEventProducer.userCreatedEvent(userDTO);

        Authentication authentication = new UsernamePasswordAuthenticationToken(savedUser.getEmail(), savedUser.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtProvider.generateToken(authentication);

        AuthResponse response = new AuthResponse();
        response.setTitle("Welcome " + createdUser.getEmail());
        response.setMessage("Register success");
        response.setUser(UserMapper.toDTO(savedUser));
        response.setJwt(jwt);
        return response;
    }

    @Override
    public AuthResponse login(String username, String password) throws UserException {
        Authentication authentication = authenticate(username, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String role =  authorities.iterator().next().getAuthority();
        String token = jwtProvider.generateToken(authentication);

        User user = userRepository.findByEmail(username);

//        update last Login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        AuthResponse response = new AuthResponse();
        response.setTitle("Login success");
        response.setMessage("Welcome Back" + username);
        response.setJwt(token);
        response.setUser(UserMapper.toDTO(user));

        return response;
    }

    public Authentication authenticate(String email, String password) throws UserException {

        UserDetails userDetails = customUserImplementation.loadUserByUsername(email);
        if(userDetails == null) {
            throw new UserException("email id doesn't exist "+ email);
        }
        if(!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new UserException("Wrong Password ");
        }
        return new UsernamePasswordAuthenticationToken(email, null, userDetails.getAuthorities());
    }

    @Transactional
    public void createPasswordResetToken(String email) throws UserException {
        User user = userRepository.findByEmail(email);

        // Always return/give same response to caller to avoid enumeration attacks.
        if (user==null) {

            throw new UserException("user not found with given email");
        }



        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(5)) // 5 minutes expiry
                .build();

        passwordResetTokenRepository.save(resetToken);

        String resetLink =  frontendResetUrl + token;
        String subject = "Password Reset Request";
        String body = "You requested to reset your password. Use this link (valid 5 minutes): " + resetLink;

        emailService.sendEmail(user.getEmail(), subject, body);
    }


    @Transactional
    public void resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> optionalToken = passwordResetTokenRepository.findByToken(token);
        if (optionalToken.isEmpty()) {
            throw new BadCredentialsException("Invalid or expired token");
        }

        PasswordResetToken resetToken = optionalToken.get();

        if (resetToken.isExpired()) {
            // token expired — delete it
            passwordResetTokenRepository.delete(resetToken);
            throw new BadCredentialsException("Invalid or expired token");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // delete token after successful reset
        passwordResetTokenRepository.delete(resetToken);

    }
}
