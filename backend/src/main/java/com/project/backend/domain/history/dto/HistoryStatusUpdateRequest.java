package com.project.backend.domain.history.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HistoryStatusUpdateRequest {
    //업데이트할 상태의 타입입니다.
    //유효값: "CLICKED" 또는 "CONVERTED"
    private String statusType;
    
    // 설정할 상태 값입니다. (true: 기록, false: 기록 해제)
    private boolean value; 
}