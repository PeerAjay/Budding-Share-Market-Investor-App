package com.shareapp.controller;

import com.shareapp.DataTransferObjects.LeaderboardResponseDTO;
import com.shareapp.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping
    public ResponseEntity<LeaderboardResponseDTO> getLeaderboard(@RequestParam Long userId) {
        return ResponseEntity.ok(leaderboardService.getLeaderboard(userId));
    }

}
