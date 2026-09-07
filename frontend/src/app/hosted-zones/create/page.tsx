"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import type { HostedZoneType } from "@/types/api";

export default function CreateHostedZonePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<HostedZoneType>("PUBLIC");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const MAX_DESC = 256;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = name.trim().toLowerCase().replace(/\.+$/, "");
    if (!cleanName) {
      setNameError("Domain name is required.");
      return;
    }

    setNameError(null);
    setApiError(null);
    setIsSubmitting(true);

    try {
      const created = await apiClient.createHostedZone({
        name: cleanName,
        type,
        description: description.trim() || undefined,
      });
      // Navigate to the new zone's detail page
      router.push(`/hosted-zones/${created.id}`);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to create hosted zone.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="aws-create-page">
      {/* Page title */}
      <h1 className="aws-create-page-title">
        Create hosted zone
        <span className="aws-label-info" style={{ fontSize: "13px", fontWeight: 400 }}>Info</span>
      </h1>

      <form onSubmit={handleSubmit} noValidate>
        {/* API error */}
        {apiError && (
          <div className="aws-alert error" style={{ marginBottom: "16px" }}>
            <span>{apiError}</span>
          </div>
        )}

        {/* Hosted zone configuration */}
        <div className="aws-create-section">
          <div className="aws-create-section-header">
            <h2>Hosted zone configuration</h2>
            <p>
              A hosted zone is a container that holds information about how you want to route
              traffic for a domain, such as example.com, and its subdomains.
            </p>
          </div>
          <div className="aws-create-section-body">

            {/* Domain name */}
            <div className="aws-form-group">
              <label htmlFor="hz-name" className="aws-label">
                Domain name
                <span className="aws-label-info">Info</span>
              </label>
              <p className="aws-form-desc">
                This is the name of the domain that you want to route traffic for.
              </p>
              <input
                id="hz-name"
                type="text"
                className={`aws-input${nameError ? " error" : ""}`}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError(null);
                  if (apiError) setApiError(null);
                }}
                placeholder="example.com"
                disabled={isSubmitting}
                autoFocus
                style={{ maxWidth: "660px" }}
              />
              {nameError ? (
                <span className="aws-form-error">{nameError}</span>
              ) : (
                <span className="aws-form-hint">
                  Valid characters: a-z, 0-9, ! &quot; # $ % &amp; &apos; ( ) * + , - . / : ; &lt; = &gt; ? @ [ \ ] ^ _ ` &#x7B; | &#x7D; ~
                </span>
              )}
            </div>

            {/* Description */}
            <div className="aws-form-group">
              <label htmlFor="hz-description" className="aws-label">
                Description
                <span className="aws-label-optional">- optional</span>
                <span className="aws-label-info">Info</span>
              </label>
              <p className="aws-form-desc">
                This value lets you distinguish hosted zones that have the same name.
              </p>
              <textarea
                id="hz-description"
                className="aws-textarea"
                rows={3}
                value={description}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_DESC) setDescription(e.target.value);
                }}
                placeholder="The hosted zone is used for..."
                disabled={isSubmitting}
                style={{ maxWidth: "660px", fontFamily: "var(--font)", fontSize: "13px" }}
              />
              <span className="aws-char-count">
                The description can have up to {MAX_DESC} characters. {description.length}/{MAX_DESC}
              </span>
            </div>

            {/* Type */}
            <div className="aws-form-group">
              <label className="aws-label">
                Type
                <span className="aws-label-info">Info</span>
              </label>
              <p className="aws-form-desc">
                The type indicates whether you want to route traffic on the internet or in an Amazon VPC.
              </p>

              <div className="aws-radio-cards" style={{ maxWidth: "660px" }}>
                {/* Public */}
                <label
                  className={`aws-radio-card${type === "PUBLIC" ? " selected" : ""}`}
                  htmlFor="type-public"
                >
                  <input
                    id="type-public"
                    type="radio"
                    name="hz-type"
                    value="PUBLIC"
                    checked={type === "PUBLIC"}
                    onChange={() => setType("PUBLIC")}
                    disabled={isSubmitting}
                  />
                  <div className="aws-radio-card-body">
                    <div className="aws-radio-card-title">Public hosted zone</div>
                    <div className="aws-radio-card-desc">
                      A public hosted zone determines how traffic is routed on the internet.
                    </div>
                  </div>
                </label>

                {/* Private */}
                <label
                  className={`aws-radio-card${type === "PRIVATE" ? " selected" : ""}`}
                  htmlFor="type-private"
                >
                  <input
                    id="type-private"
                    type="radio"
                    name="hz-type"
                    value="PRIVATE"
                    checked={type === "PRIVATE"}
                    onChange={() => setType("PRIVATE")}
                    disabled={isSubmitting}
                  />
                  <div className="aws-radio-card-body">
                    <div className="aws-radio-card-title">Private hosted zone</div>
                    <div className="aws-radio-card-desc">
                      A private hosted zone determines how traffic is routed within an Amazon VPC.
                    </div>
                  </div>
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* Tags section (visual placeholder only) */}
        <div className="aws-create-section">
          <div className="aws-create-section-header" style={{ paddingBottom: "14px" }}>
            <h2 style={{ marginBottom: "0" }}>
              Tags
              <span className="aws-label-info" style={{ marginLeft: "8px", fontSize: "13px", fontWeight: 400 }}>Info</span>
            </h2>
          </div>
          <div className="aws-create-section-body">
            <p style={{ fontSize: "13px", color: "var(--aws-text-secondary)" }}>
              Tags are key-value pairs that help you organize, track, and control access to your AWS resources.
              You can add up to 10 tags per hosted zone.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="aws-create-footer">
          <button
            type="button"
            className="aws-btn aws-btn-secondary"
            onClick={() => router.push("/hosted-zones")}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="aws-btn aws-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="aws-spinner" style={{ width: "12px", height: "12px", borderWidth: "2px" }} />
                Creating...
              </>
            ) : (
              "Create hosted zone"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
