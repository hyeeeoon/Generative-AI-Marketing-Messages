package com.project.backend.domain.notice.service;

import com.project.backend.domain.notice.entity.Notice;
import com.project.backend.domain.notice.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NoticeService {
    private final NoticeRepository noticeRepository;

    public List<Notice> getAllNotices() {
        return noticeRepository.findAllByOrderByCreatedAtDesc();
    }

    public Notice createNotice(String title, String content, String author) {
        Notice notice = Notice.builder()
                .title(title)
                .content(content)
                .author(author)
                .build();
        return noticeRepository.save(notice);
    }
}