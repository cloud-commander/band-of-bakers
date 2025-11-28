import { describe, it, expect } from "vitest";
import {
  sanitizeHtml,
  sanitizeText,
  sanitizeFileName,
  sanitizeUrl,
  sanitizeEmail,
  sanitizePhone,
} from "../sanitize";
import { XSS_ATTACK_VECTORS, PATH_TRAVERSAL_VECTORS } from "@/tests/helpers";

describe("Sanitization Utilities", () => {
  describe("sanitizeHtml", () => {
    describe("basic mode", () => {
      it("should allow safe basic tags", () => {
        const input = "<p>Hello <strong>world</strong></p>";
        const output = sanitizeHtml(input, "basic");
        expect(output).toContain("Hello");
        expect(output).toContain("world");
      });

      it("should remove all XSS vectors", () => {
        XSS_ATTACK_VECTORS.forEach((vector) => {
          const output = sanitizeHtml(vector, "basic");
          expect(output).not.toContain("<script");
          expect(output).not.toContain("javascript:");
          expect(output).not.toContain("onerror");
          expect(output).not.toContain("onload");
          expect(output).not.toContain("onfocus");
        });
      });

      it("should remove script tags completely", () => {
        const input = '<p>Hello</p><script>alert("XSS")</script><p>World</p>';
        const output = sanitizeHtml(input, "basic");
        expect(output).toContain("Hello");
        expect(output).toContain("World");
        expect(output).not.toContain("<script>");
        expect(output).not.toContain("alert");
      });

      it("should remove event handlers", () => {
        const input = '<img src="image.jpg" onerror="alert(\'XSS\')" />';
        const output = sanitizeHtml(input, "basic");
        expect(output).not.toContain("onerror");
        expect(output).not.toContain("alert");
      });

      it("should remove iframe tags", () => {
        const input = '<p>Content</p><iframe src="evil.com"></iframe>';
        const output = sanitizeHtml(input, "basic");
        expect(output).toContain("Content");
        expect(output).not.toContain("<iframe");
      });

      it("should handle empty strings", () => {
        expect(sanitizeHtml("", "basic")).toBe("");
      });

      it("should handle plain text without HTML", () => {
        const input = "Just plain text";
        const output = sanitizeHtml(input, "basic");
        expect(output).toBe(input);
      });
    });

    describe("rich mode", () => {
      it("should allow rich formatting tags", () => {
        const input =
          "<h1>Title</h1><p>Paragraph with <strong>bold</strong> and <em>italic</em></p><ul><li>Item</li></ul>";
        const output = sanitizeHtml(input, "rich");
        expect(output).toContain("<h1>");
        expect(output).toContain("<strong>");
        expect(output).toContain("<em>");
        expect(output).toContain("<ul>");
        expect(output).toContain("<li>");
      });

      it("should still remove XSS vectors in rich mode", () => {
        XSS_ATTACK_VECTORS.forEach((vector) => {
          const output = sanitizeHtml(vector, "rich");
          expect(output).not.toContain("<script");
          expect(output).not.toContain("javascript:");
          expect(output).not.toContain("onerror");
        });
      });

      it("should allow safe links but sanitize href", () => {
        const input = '<a href="https://example.com">Link</a>';
        const output = sanitizeHtml(input, "rich");
        expect(output).toContain("href");
        expect(output).toContain("example.com");
      });

      it("should remove javascript: protocol in links", () => {
        const input = "<a href=\"javascript:alert('XSS')\">Click</a>";
        const output = sanitizeHtml(input, "rich");
        expect(output).not.toContain("javascript:");
      });

      it("should allow images with safe attributes", () => {
        const input = '<img src="https://example.com/image.jpg" alt="Test" />';
        const output = sanitizeHtml(input, "rich");
        expect(output).toContain("<img");
        expect(output).toContain("src");
        expect(output).toContain("alt");
      });
    });
  });

  describe("sanitizeText", () => {
    it("should strip all HTML tags", () => {
      const input = "<p>Hello <strong>world</strong></p>";
      const output = sanitizeText(input);
      expect(output).toBe("Hello world");
    });

    it("should remove script tags and their content", () => {
      const input = 'Before<script>alert("XSS")</script>After';
      const output = sanitizeText(input);
      expect(output).not.toContain("<script>");
      expect(output).not.toContain("alert");
    });

    it("should handle nested tags", () => {
      const input = "<div><p><strong><em>Text</em></strong></p></div>";
      const output = sanitizeText(input);
      expect(output).toBe("Text");
    });

    it("should preserve plain text", () => {
      const input = "Just plain text";
      const output = sanitizeText(input);
      expect(output).toBe(input);
    });

    it("should trim whitespace", () => {
      const input = "  <p>  Text  </p>  ";
      const output = sanitizeText(input);
      expect(output).toBe("Text");
    });
  });

  describe("sanitizeFileName", () => {
    it("should allow safe filenames", () => {
      const input = "my-document.pdf";
      const output = sanitizeFileName(input);
      expect(output).toBe(input);
    });

    it("should prevent path traversal attacks", () => {
      PATH_TRAVERSAL_VECTORS.forEach((vector) => {
        const output = sanitizeFileName(vector);
        expect(output).not.toContain("..");
        expect(output).not.toContain("/");
        expect(output).not.toContain("\\");
      });
    });

    it("should remove directory separators", () => {
      const input = "../../../etc/passwd";
      const output = sanitizeFileName(input);
      expect(output).not.toContain("/");
      expect(output).not.toContain("..");
    });

    it("should remove null bytes", () => {
      const input = "file\x00.txt";
      const output = sanitizeFileName(input);
      expect(output).not.toContain("\x00");
    });

    it("should preserve file extensions", () => {
      const input = "document.pdf";
      const output = sanitizeFileName(input);
      expect(output).toContain(".pdf");
    });

    it("should handle multiple dots", () => {
      const input = "my.file.name.txt";
      const output = sanitizeFileName(input);
      expect(output).toContain(".");
    });

    it("should limit filename length", () => {
      const input = "a".repeat(300) + ".txt";
      const output = sanitizeFileName(input);
      expect(output.length).toBeLessThanOrEqual(255);
    });
  });

  describe("sanitizeUrl", () => {
    it("should allow safe HTTP URLs", () => {
      const input = "https://example.com/page";
      const output = sanitizeUrl(input);
      expect(output).toBe(input);
    });

    it("should allow HTTPS URLs by default", () => {
      const input = "https://secure.example.com";
      const output = sanitizeUrl(input);
      expect(output).toBe("https://secure.example.com/");
    });

    it("should reject javascript: protocol", () => {
      const input = 'javascript:alert("XSS")';
      expect(() => sanitizeUrl(input)).toThrow();
    });

    it("should reject data: URLs by default", () => {
      const input = 'data:text/html,<script>alert("XSS")</script>';
      expect(() => sanitizeUrl(input)).toThrow();
    });

    it("should allow custom protocols when specified", () => {
      const input = "mailto:test@example.com";
      const output = sanitizeUrl(input, ["mailto", "https"]);
      expect(output).toBe(input);
    });

    it("should reject URLs without protocol", () => {
      const input = "example.com";
      expect(() => sanitizeUrl(input)).toThrow();
    });

    it("should handle empty strings", () => {
      expect(() => sanitizeUrl("")).toThrow();
    });
  });

  describe("sanitizeEmail", () => {
    it("should validate correct email addresses", () => {
      const validEmails = [
        "test@example.com",
        "user.name@example.co.uk",
        "first+last@test.com",
        "admin@subdomain.example.com",
      ];

      validEmails.forEach((email) => {
        const output = sanitizeEmail(email);
        expect(output).toBe(email.toLowerCase());
      });
    });

    it("should normalize email to lowercase", () => {
      const input = "Test@Example.COM";
      const output = sanitizeEmail(input);
      expect(output).toBe("test@example.com");
    });

    it("should reject invalid email formats", () => {
      const invalidEmails = [
        "not-an-email",
        "@example.com",
        "user@",
        "user@.com",
        "user name@example.com",
        "",
      ];

      invalidEmails.forEach((email) => {
        expect(() => sanitizeEmail(email)).toThrow();
      });
    });

    it("should trim whitespace", () => {
      const input = "  test@example.com  ";
      const output = sanitizeEmail(input);
      expect(output).toBe("test@example.com");
    });
  });

  describe("sanitizePhone", () => {
    it("should validate UK mobile numbers", () => {
      const validNumbers = [
        "07700900000",
        "07700 900 000",
        "+447700900000",
        "+44 7700 900000",
        "447700900000",
      ];

      validNumbers.forEach((number) => {
        const output = sanitizePhone(number);
        expect(output).toMatch(/^\+447\d{9}$/);
      });
    });

    it("should normalize UK numbers to E.164 format", () => {
      const input = "07700 900 000";
      const output = sanitizePhone(input);
      expect(output).toBe("+447700900000");
    });

    it("should handle numbers starting with +44", () => {
      const input = "+44 7700 900000";
      const output = sanitizePhone(input);
      expect(output).toBe("+447700900000");
    });

    it("should handle numbers starting with 0044", () => {
      const input = "0044 7700 900000";
      const output = sanitizePhone(input);
      expect(output).toBe("+447700900000");
    });

    it("should reject invalid UK numbers", () => {
      const invalidNumbers = [
        "1234567890",
        "08000000000", // Not mobile
        "+1234567890", // Not UK
        "not-a-number",
        "",
      ];

      invalidNumbers.forEach((number) => {
        expect(() => sanitizePhone(number)).toThrow();
      });
    });

    it("should remove spaces and hyphens", () => {
      const input = "077-00 900-000";
      const output = sanitizePhone(input);
      expect(output).not.toContain(" ");
      expect(output).not.toContain("-");
    });
  });
});
