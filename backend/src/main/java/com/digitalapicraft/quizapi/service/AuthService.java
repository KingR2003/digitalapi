package com.digitalapicraft.quizapi.service;

import com.digitalapicraft.quizapi.config.JwtTokenProvider;
import com.digitalapicraft.quizapi.config.UserPrincipal;
import com.digitalapicraft.quizapi.dto.AuthRequest;
import com.digitalapicraft.quizapi.dto.AuthResponse;
import com.digitalapicraft.quizapi.dto.RegisterRequest;
import com.digitalapicraft.quizapi.entity.Role;
import com.digitalapicraft.quizapi.entity.User;
import com.digitalapicraft.quizapi.exception.BadRequestException;
import com.digitalapicraft.quizapi.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final WalletService walletService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(
            UserRepository userRepository,
            WalletService walletService,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.walletService = walletService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName(),
                Role.ROLE_USER
        );
        user = userRepository.save(user);

        // Automatically allocate 500 initial bonus credits
        walletService.initializeWalletForUser(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole(),
                walletService.getBalance(user.getId())
        );
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = tokenProvider.generateToken(authentication);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        return new AuthResponse(
                token,
                principal.getId(),
                principal.getUsername(),
                principal.getFullName(),
                principal.getRole(),
                walletService.getBalance(principal.getId())
        );
    }
}

