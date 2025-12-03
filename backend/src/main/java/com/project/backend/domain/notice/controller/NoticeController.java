package com.project.backend.domain.notice.controller;

import com.project.backend.domain.notice.entity.Notice;
import com.project.backend.domain.notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class NoticeController {
    private final NoticeService noticeService;

    @GetMapping
    public List<Notice> getNotices() {
        return noticeService.getAllNotices();
    }

    @PostMapping
    public Notice createNotice(@RequestBody Notice notice) {
        return noticeService.createNotice(notice.getTitle(), notice.getContent(), "관리자");
    }
}