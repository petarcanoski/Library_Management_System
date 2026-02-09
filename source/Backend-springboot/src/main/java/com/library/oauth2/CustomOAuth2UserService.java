package com.library.oauth2;

import com.library.domain.AuthProvider;
import com.library.domain.UserRole;
import com.library.model.User;
import com.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        // Process OAuth2 user info
        return processOAuth2User(userRequest, oauth2User);
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oauth2User) {
        // Extract user info from Google
        Map<String, Object> attributes = oauth2User.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String picture = (String) attributes.get("picture");
        String googleId = (String) attributes.get("sub");

        // Check if user already exists
        User user = userRepository.findByEmail(email);

        if (user == null) {
            // Create new user
            user = createNewUser(email, name, picture, googleId);
        } else {
            // Update existing user
            user = updateExistingUser(user, name, picture, googleId);
        }

        return new OAuth2UserPrincipal(user, oauth2User.getAttributes());
    }

    private User createNewUser(String email, String name, String picture, String googleId) {
        User user = new User();
        user.setEmail(email);
        user.setFullName(name);
        user.setProfileImage(picture);
        user.setGoogleId(googleId);
        user.setAuthProvider(AuthProvider.GOOGLE);
        user.setRole(UserRole.ROLE_USER);
        user.setVerified(true); // Google users are pre-verified
        user.setLastLogin(LocalDateTime.now());

        return userRepository.save(user);
    }

    private User updateExistingUser(User user, String name, String picture, String googleId) {
        // Update user info if needed
        if (user.getAuthProvider() == AuthProvider.LOCAL) {
            // Link Google account to existing local account
            user.setAuthProvider(AuthProvider.GOOGLE);
        }

        user.setGoogleId(googleId);
        user.setProfileImage(picture);
        user.setFullName(name);
        user.setVerified(true);
        user.setLastLogin(LocalDateTime.now());

        return userRepository.save(user);
    }
}
