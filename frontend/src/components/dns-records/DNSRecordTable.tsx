"use client";

import React from "react";
import type { DNSRecord } from "@/types/api";

interface DNSRecordTableProps {
  records: DNSRecord[];
  selectedRecord?: DNSRecord | null;
  onSelectRecord?: (record: DNSRecord) => void;
  onEdit: (record: DNSRecord) => void;
  onDelete: (record: DNSRecord) => void;
}

export const DNSRecordTable: React.FC<DNSRecordTableProps> = ({
  records,
  selectedRecord,
  onSelectRecord,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="aws-table-wrapper">
      <table className="aws-table">
        <thead>
          <tr>
            <th style={{ width: "36px" }}></th>
            <th>
              <button type="button" className="aws-table-sort-btn">
                Record name <span className="aws-table-sort-icon">▼</span>
              </button>
            </th>
            <th style={{ width: "80px" }}>
              <button type="button" className="aws-table-sort-btn">
                Type <span className="aws-table-sort-icon">▼</span>
              </button>
            </th>
            <th>Value / Route traffic to</th>
            <th style={{ width: "120px", textAlign: "right" }}>TTL (seconds)</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            const isSelected = selectedRecord?.id === record.id;
            return (
              <tr
                key={record.id}
                className={isSelected ? "selected" : ""}
                onClick={() => onSelectRecord?.(record)}
                onDoubleClick={() => onEdit(record)}
                style={{ cursor: "pointer" }}
              >
                <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                  <input
                    type="radio"
                    name="selectedRecord"
                    aria-label={`Select record ${record.name}`}
                    checked={isSelected}
                    onChange={() => onSelectRecord?.(record)}
                    className="aws-table-radio"
                  />
                </td>
                <td>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "13px",
                      wordBreak: "break-word",
                      maxWidth: "240px",
                      display: "inline-block",
                    }}
                    title={record.name}
                  >
                    {record.name}
                  </span>
                </td>
                <td>
                  <span className="aws-record-type">{record.type}</span>
                </td>
                <td>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      wordBreak: "break-all",
                      maxWidth: "380px",
                      display: "block",
                      lineHeight: "1.4",
                    }}
                    title={record.value}
                  >
                    {record.value}
                  </span>
                </td>
                <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)", fontSize: "13px" }}>
                  {record.ttl}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
