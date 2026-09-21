# fleetsysops.com: Markdown files and the 90-line server that hands them out. No install, no build.
FROM oven/bun:1.4
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --chown=bun:bun . .
USER bun
EXPOSE 3000
CMD ["bun", "server.ts"]
