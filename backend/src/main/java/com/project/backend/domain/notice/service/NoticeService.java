// src/main/java/com/project/backend/domain/notice/service/NoticeService.java
package com.project.backend.domain.notice.service;

import com.project.backend.domain.notice.entity.Notice;
import com.project.backend.domain.notice.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NoticeService {

    private final NoticeRepository noticeRepository;

    public List<Notice> getAllNotices() {
        return noticeRepository.findAllByOrderByImportantDescCreatedAtDesc();
    }

    public Notice createNotice(String title, String content, String author, boolean isImportant) {
        Notice notice = Notice.builder()
                .title(title)
                .content(content)
                .author(author)
                .important(isImportant)
                .build();

        notice.setCreatedAt(LocalDateTime.now());
        notice.setUpdatedAt(LocalDateTime.now());
        return noticeRepository.save(notice);
    }

    public Notice updateNotice(Long id, String title, String content, boolean isImportant) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("공지사항 없음"));

        notice.setTitle(title);
        notice.setContent(content);
        notice.setImportant(isImportant);
        notice.setUpdatedAt(LocalDateTime.now());

        return noticeRepository.save(notice);
    }

    public void deleteNotice(Long id) {
        noticeRepository.deleteById(id);
    }
}