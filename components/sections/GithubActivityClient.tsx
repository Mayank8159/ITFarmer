"use client";

import React, { useState } from 'react';
import { Terminal, GitCommit, GitPullRequest, GitMerge, FolderGit2, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

export default function GithubActivityClient({ initialEvents, totalVelocity }: { initialEvents: any[], totalVelocity: number }) {
  const [activeFounder, setActiveFounder] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<'24h' | '20'>('24h');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // Derive unique founders and their avatars from events
  const foundersList = Array.from(new Set(initialEvents.map(e => e.actor.login)));
  const founderData = foundersList.map(login => {
    const event = initialEvents.find(e => e.actor.login === login);
    return { login, avatar_url: event?.actor.avatar_url || '' };
  });

  // Filter events
  let filteredEvents = activeFounder 
    ? initialEvents.filter(e => e.actor.login === activeFounder)
    : initialEvents;

  if (timeFilter === '24h') {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).getTime();
    filteredEvents = filteredEvents.filter(e => new Date(e.created_at).getTime() >= twentyFourHoursAgo);
  }

  // GROUP EVENTS BY REPOSITORY & FOUNDER
  const groupsRecord: Record<string, any> = {};
  
  filteredEvents.forEach(event => {
    const groupId = `${event.actor.login}-${event.repo.name}`;
    if (!groupsRecord[groupId]) {
      groupsRecord[groupId] = {
        id: groupId,
        founder: event.actor.login,
        avatar_url: event.actor.avatar_url,
        repoName: event.repo.name.split('/').pop(),
        fullRepoName: event.repo.name,
        readmeSnippet: event.readmeSnippet,
        lastActive: new Date(event.created_at),
        commits: []
      };
    }
    
    // Add event to commits list
    groupsRecord[groupId].commits.push(event);
    
    // Update lastActive if this event is newer
    const eventDate = new Date(event.created_at);
    if (eventDate > groupsRecord[groupId].lastActive) {
      groupsRecord[groupId].lastActive = eventDate;
    }
  });

  // Convert to array and sort by most recent activity
  let groupedEvents = Object.values(groupsRecord).sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime());

  // Cap at 12 Unique Repository Clusters
  groupedEvents = groupedEvents.slice(0, 12);

  return (
    <section className="relative w-full py-24 bg-[#e5e5e5] text-black overflow-hidden border-b-4 border-black z-10">
      <div className="absolute inset-0 grid-background opacity-100 pointer-events-none" />
      
      <div className="max-w-[1600px] mx-auto px-6 relative z-10">
        
        {/* HEADER */}
        <div className="mb-8 border-b border-black/15 pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#ff6b00] mb-4 block font-bold">SWARM TELEMETRY</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black uppercase max-w-3xl leading-[0.9]">
              LIVE REPO ACTIVITY.
            </h2>
          </div>
          
          <div className="flex items-center gap-4 bg-white border-2 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0">
            <div className="w-10 h-10 bg-black flex items-center justify-center shrink-0">
              <Terminal className="w-5 h-5 text-[#ff6b00]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse" />
                <span className="text-black font-mono text-[10px] uppercase tracking-widest font-bold">API.GITHUB.COM CONNECTED</span>
              </div>
              <div className="text-[9px] font-mono uppercase tracking-widest text-[#ff6b00] font-bold">
                LIVE VELOCITY: {totalVelocity} ACTIONS LOGGED
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE CONTROLS */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {/* Founder Filter */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-black/50">NODE FILTER:</span>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setActiveFounder(null)}
                className={`px-4 py-2 font-mono text-xs font-bold uppercase transition-colors border-2 ${activeFounder === null ? 'bg-black text-white border-black' : 'bg-transparent text-black border-black/20 hover:border-black'}`}
              >
                ALL NODES
              </button>
              {founderData.map(founder => (
                <button
                  key={founder.login}
                  onClick={() => setActiveFounder(founder.login)}
                  className={`flex items-center gap-2 px-3 py-1 font-mono text-xs font-bold uppercase transition-colors border-2 ${activeFounder === founder.login ? 'bg-black text-white border-black' : 'bg-transparent text-black border-black/20 hover:border-black'}`}
                >
                  <img src={founder.avatar_url} alt={founder.login} className={`w-6 h-6 border ${activeFounder === founder.login ? 'border-white/20' : 'border-black'}`} />
                  {founder.login}
                </button>
              ))}
            </div>
          </div>

          {/* Time Filter */}
          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-black/20 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-black/50">TIMEFRAME:</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setTimeFilter('24h')}
                className={`px-3 py-1 font-mono text-[10px] font-bold uppercase transition-colors border-2 ${timeFilter === '24h' ? 'bg-[#ff6b00] text-white border-[#ff6b00]' : 'bg-transparent text-black border-black/20 hover:border-black'}`}
              >
                LAST 24 HOURS
              </button>
              <button 
                onClick={() => setTimeFilter('20')}
                className={`px-3 py-1 font-mono text-[10px] font-bold uppercase transition-colors border-2 ${timeFilter === '20' ? 'bg-[#ff6b00] text-white border-[#ff6b00]' : 'bg-transparent text-black border-black/20 hover:border-black'}`}
              >
                LAST 20 LOGS
              </button>
            </div>
          </div>
        </div>

        {/* COMPACT FEED */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {groupedEvents.length === 0 ? (
            <div className="col-span-full text-center p-12 bg-white border-4 border-black font-mono text-sm text-black/50 uppercase tracking-widest">
              No activity found for this filter.
            </div>
          ) : (
            groupedEvents.map((group) => {
              return (
                <div 
                  key={group.id} 
                  className="bg-white border-2 border-black flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  {/* Top Header - Actor */}
                  <div className="p-3 border-b-2 border-black bg-black flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img 
                        src={group.avatar_url} 
                        alt={group.founder} 
                        className="w-5 h-5 border border-white/20"
                      />
                      <span className="font-mono text-[9px] font-bold text-white uppercase tracking-widest truncate max-w-[100px]">
                        {group.founder}
                      </span>
                    </div>
                    <div className="text-white text-[9px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded shrink-0">
                      {group.commits.length} ACTION{group.commits.length > 1 ? 'S' : ''}
                    </div>
                  </div>

                  {/* Body - Repo Context */}
                  <div className="p-4 flex-1 flex flex-col gap-4">
                    <div>
                      <a href={`https://github.com/${group.fullRepoName}`} target="_blank" rel="noreferrer" className="font-black text-sm uppercase text-black hover:text-[#ff6b00] transition-colors flex items-center gap-1 break-all mb-2">
                        {group.repoName} <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                      <p className="font-mono text-[10px] text-black/70 line-clamp-3 leading-relaxed min-h-[45px]">
                        {group.readmeSnippet}
                      </p>
                    </div>

                    {/* Expand/Collapse Button */}
                    <button 
                      onClick={() => toggleGroup(group.id)}
                      className="flex items-center justify-between w-full p-2 border-2 border-black font-mono text-[10px] font-bold uppercase hover:bg-black hover:text-white transition-colors"
                    >
                      <span>View Activity Log</span>
                      {expandedGroups[group.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    
                    {/* Expanded Commits List */}
                    {expandedGroups[group.id] && (
                      <div className="flex flex-col gap-2 mt-2 max-h-48 overflow-y-auto pr-1">
                        {group.commits.map((evt: any, i: number) => {
                          let icon = <GitCommit className="w-3 h-3" />;
                          let actionTitle = "Committed Code";
                          
                          if (evt.type === 'PushEvent') {
                            actionTitle = "Pushed Code";
                          } else if (evt.type === 'PullRequestEvent') {
                            actionTitle = `${evt.payload.action === 'opened' ? 'Opened' : 'Merged'} PR`;
                            icon = evt.payload.action === 'closed' ? <GitMerge className="w-3 h-3 text-[#ff6b00]" /> : <GitPullRequest className="w-3 h-3 text-black" />;
                          } else if (evt.type === 'CreateEvent') {
                            actionTitle = "Created Ref";
                            icon = <FolderGit2 className="w-3 h-3 text-black" />;
                          }

                          return (
                            <div key={i} className="bg-[#f0f0f0] border-l-2 border-[#ff6b00] p-2 flex flex-col gap-1">
                              <div className="flex items-center justify-between text-[9px] font-bold text-black/50 uppercase">
                                <span className="flex items-center gap-1">{icon} {actionTitle}</span>
                                <span>{new Date(evt.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              </div>
                              {evt.type === 'PushEvent' && evt.payload.commits?.[0] ? (
                                <a 
                                  href={`https://github.com/${evt.repo.name}/commit/${evt.payload.commits[0].sha}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-mono text-[10px] font-bold text-black hover:text-[#ff6b00] transition-colors break-words"
                                >
                                  "{evt.payload.commits[0].message}"
                                </a>
                              ) : (
                                <div className="font-mono text-[10px] font-bold text-black break-words">
                                  {evt.payload.ref_type ? `Created ${evt.payload.ref_type} ${evt.payload.ref || ''}` : ''}
                                  {evt.type === 'PullRequestEvent' ? evt.payload.pull_request?.title : ''}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  {/* Timestamp Footer */}
                  <div className="mt-auto p-2 border-t-2 border-black bg-[#f8f8f8] text-center">
                    <span className="text-[8px] font-mono font-bold text-black/50 uppercase tracking-widest">
                      Last Active: {group.lastActive.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
