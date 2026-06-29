# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marcable is a trademark similarity search engine supporting multi-country, multi-algorithm phonetic search. Starting with Colombia (SIC office), with schema designed for country expansion.

## Architecture

Multi-service pipeline with four main components:

1. **Next.js Frontend** — Public-facing: search interface, user accounts, subscriptions
2. **FilamentPHP/Laravel Admin** — Admin panel: catalogs, phonetic rules, ingestion monitoring
3. **Node.js Scraper (Worker 1)** — Scrapes trademark office data into `raw_trademarks`
4. **Python Enrichment (Worker 2)** — Phonetics (epitran/IPA), transliteration, embeddings

**Data flow:** Scrape → `raw_trademarks` → normalize → `trademarks` + `denominations` → enrich → searchable

## Database

- **Supabase/PostgreSQL 15+** with extensions: `pgvector`, `pg_trgm`, `fuzzystrmatch`
- **Schema version:** v5
- **Key table:** `denominations` — nucleus of the similarity engine. Multiple phonetic algorithms weighted by configurable `similarity_profiles`.

## Key Concepts

- **Denominations** are the core searchable unit, not raw trademarks
- **Similarity profiles** configure which phonetic algorithms are used and their weights
- All implementation decisions should support the multi-worker pipeline architecture and phonetic similarity search as the core feature

## Working Rules

- Think before acting. Read files before writing code.
- Edit only what changes — never rewrite entire files.
- Don't re-read files already read unless they changed.
- Don't repeat unchanged code in responses.
- No preambles, no trailing summaries, no explaining the obvious.
- Test before marking work as done.
