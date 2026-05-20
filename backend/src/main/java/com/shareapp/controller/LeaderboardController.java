package com.shareapp.controller;

import com.shareapp.DataTransferObjects.LeaderboardResponseDTO;
import com.shareapp.repository.UserRepository;
import org.springframework.security.core.Authentication;
import com.shareapp.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;
    private final UserRepository userRepository;

    public LeaderboardController(LeaderboardService leaderboardService, UserRepository userRepository) {
        this.leaderboardService = leaderboardService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<LeaderboardResponseDTO> getLeaderboard(Authentication authentication) {
        try {
            String username = authentication.getName();
            Long userId = userRepository.findByUsername(username).getId();
            return ResponseEntity.ok(leaderboardService.getLeaderboard(userId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

        
    }

}
