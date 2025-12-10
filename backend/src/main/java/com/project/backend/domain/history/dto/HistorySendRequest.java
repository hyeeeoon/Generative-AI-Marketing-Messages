package com.project.backend.domain.history.dto;

import lombok.Getter;
import lombok.Setter;

@Getter // <-- @Getter 필수
@Setter 
public class HistorySendRequest {
    private String customerId;
    private String customerName;
    private String messageContent;
    private String channel;
    private String event;
    private String purpose;
    private String recipient;
}