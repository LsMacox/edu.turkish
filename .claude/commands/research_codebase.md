# Research Codebase

You are tasked with conducting comprehensive research across the codebase to answer user questions by conducting parallel research and synthesizing findings.

## Initial Setup:

When this command is invoked, respond with:

```
I'm ready to research the codebase. Please provide your research question or area of interest, and I'll analyze it thoroughly by exploring relevant components and connections.
```

Then wait for the user's research query.

## Steps to follow after receiving the research query:

1. **Read any directly mentioned files first:**
   - If the user mentions specific files (tickets, docs, JSON), read them FULLY first
   - **IMPORTANT**: Read entire files
   - **CRITICAL**: Read these files yourself in the main context before conducting any further research
   - This ensures you have full context before decomposing the research

2. **Analyze and decompose the research question:**
   - Break down the user's query into composable research areas
   - Take time to think deeply about the underlying patterns, connections, and architectural implications the user might be seeking
   - Identify specific components, patterns, or concepts to investigate
   - Create a research plan to track all subtasks
   - Consider which directories, files, or architectural patterns are relevant

3. **Conduct parallel research for comprehensive coverage:**
   - Research different aspects concurrently

   The key is to research intelligently:
   - Start with locating what exists
   - Then analyze the most promising findings
   - Run multiple research steps in parallel when they're searching for different things
   - Each research step should be focused
   - Don't over-specify how to search - keep it targeted

4. **Wait for all research to complete and synthesize findings:**
   - IMPORTANT: Wait for ALL research to complete before proceeding
   - Compile all results (both codebase and historical findings)
   - Prioritize live codebase findings as primary source of truth
   - Use historical findings as supplementary context
   - Connect findings across different components
   - Include specific file paths and line numbers for reference
   - Verify all historical paths are correct
   - Highlight patterns, connections, and architectural decisions
   - Answer the user's specific questions with concrete evidence

5. **Gather metadata for the research document:**
   - Generate all relevant metadata
   - Filename: `.claude/researches/YYYY-MM-DD_HH-MM-SS_[topic].md`

6. **Generate research document:**
   - Use the metadata gathered in step 5
   - Structure the document with YAML frontmatter followed by content:

     ```markdown
     ---
     date: [Current date and time with timezone in ISO format]
     researcher: [Researcher name]
     git_commit: [Current commit hash]
     branch: [Current branch name]
     repository: [Repository name]
     topic: "[User's Question/Topic]"
     tags: [research, codebase, relevant-component-names]
     status: complete
     last_updated: [Current date in YYYY-MM-DD format]
     last_updated_by: [Researcher name]
     ---

     # Research: [User's Question/Topic]

     **Date**: [Current date and time with timezone from step 5]
     **Researcher**: [Researcher name]
     **Git Commit**: [Current commit hash from step 5]
     **Branch**: [Current branch name from step 5]
     **Repository**: [Repository name]

     ## Research Question

     [Original user query]

     ## Summary

     [High-level findings answering the user's question]

     ## Detailed Findings

     ### [Component/Area 1]

     - Finding with reference ([file.ext:line](link))
     - Connection to other components
     - Implementation details

     ### [Component/Area 2]

     ...

     ## Code References

     - `path/to/file.py:123` - Description of what's there
     - `another/file.ts:45-67` - Description of the code block

     ## Architecture Insights

     [Patterns, conventions, and design decisions discovered]

     ## Historical Context (from .claude/researches/)

     [Relevant insights from .claude/researches/ directory with references]

     - `.claude/researches/something.md` - Historical decision about X
     - `.claude/researches/notes.md` - Past exploration of Y

     ## Related Research

     [Links to other research documents in .claude/researches/]

     ## Open Questions

     [Any areas that need further investigation]
     ```

7. **Add GitHub permalinks (if applicable):**
   - Check if on main branch or if commit is pushed
   - If on main/master or pushed, generate GitHub permalinks:
     - Get repo info
     - Create permalinks: `https://github.com/{owner}/{repo}/blob/{commit}/{file}#L{line}`
   - Replace local file references with permalinks in the document

8. **Sync and present findings:**
   - Present a concise summary of findings to the user
   - Include key file references for easy navigation
   - Ask if they have follow-up questions or need clarification

9. **Handle follow-up questions:**
   - If the user has follow-up questions, append to the same research document
   - Update the frontmatter fields `last_updated` and `last_updated_by` to reflect the update
   - Add `last_updated_note: "Added follow-up research for [brief description]"` to frontmatter
   - Add a new section: `## Follow-up Research [timestamp]`
   - Conduct new research as needed for additional investigation
   - Continue updating the document and syncing

## Important notes:

- Always use parallel research to maximize efficiency and minimize context usage
- Always run fresh codebase research - never rely solely on existing research documents
- The .claude/researches/ directory provides historical context to supplement live findings
- Focus on finding concrete file paths and line numbers for developer reference
- Research documents should be self-contained with all necessary context
- Each research step should be specific and focused on read-only operations
- Consider cross-component connections and architectural patterns
- Include temporal context (when the research was conducted)
- Link to GitHub when possible for permanent references
- Keep the main focus on synthesis, not deep file reading
- Encourage finding examples and usage patterns, not just definitions
- Explore all of .claude/researches/ directory
- **File reading**: Always read mentioned files FULLY before further research
- **Critical ordering**: Follow the numbered steps exactly
  - ALWAYS read mentioned files first before research (step 1)
  - ALWAYS wait for all research to complete before synthesizing (step 4)
  - ALWAYS gather metadata before writing the document (step 5 before step 6)
  - NEVER write the research document with placeholder values
- **Path handling**: Use paths as found in .claude/researches/ directly
  - Preserve the exact directory structure
  - This ensures paths are correct for editing and navigation
- **Frontmatter consistency**:
  - Always include frontmatter at the beginning of research documents
  - Keep frontmatter fields consistent across all research documents
  - Update frontmatter when adding follow-up research
  - Use snake_case for multi-word field names (e.g., `last_updated`, `git_commit`)
  - Tags should be relevant to the research topic and components studied
