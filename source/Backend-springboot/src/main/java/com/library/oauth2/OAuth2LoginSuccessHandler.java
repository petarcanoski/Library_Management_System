package com.library.oauth2;

import com.library.configurations.JwtProvider;
import com.library.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Collections;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtProvider jwtProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2UserPrincipal oauth2User = (OAuth2UserPrincipal) authentication.getPrincipal();
        User user = oauth2User.getUser();

        // Create authentication object for JWT generation
        org.springframework.security.authentication.UsernamePasswordAuthenticationToken auth =
            new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                user.getEmail(),
                null,
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name()))
            );

        // Generate JWT token
        String token = jwtProvider.generateToken(auth);

        // Redirect to frontend with token
        String targetUrl = determineTargetUrl(token, user);

        if (response.isCommitted()) {
            logger.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    protected String determineTargetUrl(String token, User user) {
        // Redirect to frontend with token as query parameter
        // Frontend will extract the token and store it
        String frontendUrl = "http://localhost:5173/oauth2/callback";

        return UriComponentsBuilder.fromUriString(frontendUrl)
                .queryParam("token", token)
                .queryParam("email", user.getEmail())
                .queryParam("fullName", user.getFullName())
                .queryParam("role", user.getRole().name())
                .build().toUriString();
    }
}
