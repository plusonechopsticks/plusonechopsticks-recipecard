# Claude Code Preferences

## Auto-approve patterns
- Always use separate commands instead of compound cd && git commands
- Run git commands from within the working directory directly
- When deploying: run build, commit, and push as separate steps

## Git workflow
- Working directory: /tmp/plusonechopsticks-recipecard
- Always run npm run build before committing
- Never commit .env files
- After pushing, run: ~/.local/bin/vercel --prod to deploy

## General
- No need to ask permission for npm run build or git status
- Show me the plan before making code changes
- Deploy to Vercel after every approved commit
