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
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://generative-ai-marketing-messages.vercel.app"
})
public class NoticeController {

    private final NoticeService noticeService;

    // 전체 조회 (필독 먼저, 최신순)
    @GetMapping
    public List<Notice> getNotices() {
        return noticeService.getAllNotices();
    }

    // 공지사항 작성
    @PostMapping
    public ResponseEntity<Notice> createNotice(@RequestBody Notice notice) {
        Notice saved = noticeService.createNotice(
            notice.getTitle(),
            notice.getContent(),
            notice.getAuthor() != null ? notice.getAuthor() : "관리자",
            notice.isImportant() // 필독 여부 포함
        );
        return ResponseEntity.ok(saved);
    }

    // 공지사항 수정
    @PutMapping("/{id}")
    public ResponseEntity<Notice> updateNotice(@PathVariable Long id, @RequestBody Notice notice) {
        Notice updated = noticeService.updateNotice(
            id,
            notice.getTitle(),
            notice.getContent(),
            notice.isImportant()
        );
        return ResponseEntity.ok(updated);
    }

    // 공지사항 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.ok("공지사항이 삭제되었습니다.");
    }
}