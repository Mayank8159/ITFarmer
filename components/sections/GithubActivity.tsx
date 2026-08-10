import React from 'react';
import GithubActivityClient from './GithubActivityClient';

const GITHUB_USERS = ['Mayank8159', 'priyanshu-ogdev', 'MURPHIOP'];

// Helper to decode base64
function decodeBase64(str: string) {
  try {
    return Buffer.from(str, 'base64').toString('utf8');
  } catch (e) {
    return "";
  }
}

// Helper to strip markdown
function stripMarkdown(text: string) {
  return text
    .replace(/[#_*~`>\[\]\(\)]/g, '') // strip common markdown chars
    .replace(/\n+/g, ' ') // replace newlines with space
    .trim();
}

async function getMultiFounderEvents() {
  try {
    // 1. Fetch Events (30 per founder)
    const promises = GITHUB_USERS.map(user => 
      fetch(`https://api.github.com/users/${user}/events/public`, {
        next: { revalidate: 300 }
      }).then(async res => {
        if (!res.ok) throw new Error(`Failed to fetch ${user}`);
        return res.json();
      })
    );

    const results = await Promise.allSettled(promises);
    
    let allEvents: any[] = [];
    results.forEach(result => {
      if (result.status === 'fulfilled' && Array.isArray(result.value)) {
        allEvents = [...allEvents, ...result.value];
      }
    });

    // Sort by created_at descending
    allEvents.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Filter to only show relevant coding activity
    const codingEvents = allEvents.filter(event => 
      ['PushEvent', 'PullRequestEvent', 'CreateEvent'].includes(event.type)
    );

    // Get top 90 events to pass to client (to allow client-side filtering)
    const topEvents = codingEvents.slice(0, 90);

    // 2. Fetch READMEs for these repos safely
    const repoNames = Array.from(new Set(topEvents.map(e => e.repo.name)));
    const readmes: Record<string, string> = {};
    
    // Batch fetch readmes (max 5 at a time to prevent GitHub secondary rate limits)
    for (let i = 0; i < repoNames.length; i += 5) {
      const batch = repoNames.slice(i, i + 5);
      const batchPromises = batch.map(repo => 
        fetch(`https://api.github.com/repos/${repo}/readme`, {
          next: { revalidate: 300 }
        }).then(async res => {
          if (res.ok) {
            const data = await res.json();
            if (data.content) {
              let decoded = decodeBase64(data.content);
              let stripped = stripMarkdown(decoded);
              readmes[repo] = stripped.substring(0, 120) + (stripped.length > 120 ? '...' : '');
            }
          }
        }).catch(err => {
          // Silently fail if no readme
        })
      );
      await Promise.allSettled(batchPromises);
    }

    const totalVelocity = codingEvents.reduce((acc, event) => {
      if (event.type === 'PushEvent' && event.payload.commits) return acc + event.payload.commits.length;
      return acc + 1;
    }, 0);

    return {
      events: topEvents.map(event => ({
        ...event,
        readmeSnippet: readmes[event.repo.name] || "No public README provided."
      })),
      totalVelocity
    };

  } catch (error) {
    console.error('Failed to fetch github events:', error);
    return { events: [], totalVelocity: 0 };
  }
}

export default async function GithubActivity() {
  const { events, totalVelocity } = await getMultiFounderEvents();

  return <GithubActivityClient initialEvents={events} totalVelocity={totalVelocity} />;
}
