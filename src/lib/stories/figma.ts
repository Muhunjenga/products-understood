export const figmaStory = {
  company: "Figma",
  title: "The file was the product, and the link was the strategy",
  displayTitle: "The Link Was the Product",
  readTime: "17 min",
  audioDuration: "27 min",
  illustration: "/images/figma-pill.png",
  audioSrc: "https://cdn.sanity.io/files/k92utnmx/production/2c3f5c48250f2f6566bf65fef5d2606e7b0b8a04.mp3",
  chapters: [
    { id: "in-the-dropbox-folder", label: "In the Dropbox Folder" },
    { id: "two-people-one-improbable-idea", label: "Two people, one improbable idea" },
    { id: "what-they-were-actually-building", label: "What they were actually building" },
    { id: "the-physics-problem-underneath", label: "The physics problem underneath" },
    { id: "the-collaboration-nobody-wanted", label: "The collaboration nobody wanted" },
    { id: "three-years-of-not-charging", label: "Three years of not charging" },
    { id: "how-sketch-lost-and-invision-disappeared", label: "How Sketch lost and InVision disappeared" },
    { id: "the-management-crisis", label: "The management crisis" },
    { id: "the-deal-that-suspended-everything", label: "The deal that suspended everything" },
  ],
};

export const figmaArticle = `
<h2 id="in-the-dropbox-folder">In the Dropbox Folder</h2>

<p>The design file lived in a Dropbox folder. Everyone on the team had access to it, theoretically. In practice, whoever had opened it last held it hostage. If you wanted to work on the button states and your colleague was already in the file adjusting navigation, you waited. You emailed. You Slacked: <em>"Hey, are you still in the file?"</em> Then you waited some more.</p>

<p>This was the state of design in 2012. Adobe Illustrator was fifteen years old. Sketch was brand new and felt like a revelation purely because it had been built for screens rather than print. But collaboration? That remained an unsolved problem so embedded in professional practice that most designers had simply stopped thinking of it as a problem at all. It was just how design worked: one person, one file, one locked door.</p>

<p>Dylan Field was twenty years old and had just left Brown University on a Thiel Fellowship — twenty thousand dollars and two years to work on something that mattered. He had been thinking about what software would look like if it were built for the browser era, not the desktop era. The browser was already how people read, communicated, and bought things. It wasn't how they made things. That gap seemed, to him, like the most interesting place in all of technology.</p>

<p>He found Evan Wallace in a computer graphics class. Wallace had spent years obsessing over what GPUs could do — not for games, but for general-purpose rendering problems. He had a particular fascination with whether a browser could render vector graphics at the speed and fidelity of a native application. Most people assumed it couldn't. Wallace thought they weren't looking at the problem correctly.</p>

<h2 id="two-people-one-improbable-idea">Two people, one improbable idea</h2>

<p>Field and Wallace had the kind of early partnership that gets mythologized once the company succeeds. In retrospect, it looks inevitable — the business mind and the technical visionary, perfectly complementary. At the time, it looked like two people taking an enormous risk on an idea that the entire design industry would have told them was impossible.</p>

<p>The idea was this: a professional design tool, fully in the browser, with real-time multiplayer collaboration. Not a watered-down web version of a desktop tool. Not a viewer or a handoff layer. The tool itself — the thing you made stuff in — running in a tab, in Chrome, with multiple people working simultaneously, seeing each other's cursors moving across the canvas in real time.</p>

<p>Every assumption baked into design software at the time argued against this being feasible. Design tools needed the GPU. The browser couldn't access the GPU properly. Design files were large, complex data structures. The network was too slow and unreliable to keep them synchronized. Real-time collaboration at the level Figma was imagining — not just shared documents but shared creative tools — had never been done. Google Docs existed, but a paragraph of text is orders of magnitude simpler than a vector shape with twenty-seven nodes, multiple fills, and a complex blend mode applied to a component that appears six hundred times across a design system.</p>

<p>Field and Wallace spent the first year just trying to figure out if it was technically possible. Wallace built the rendering engine. Field talked to designers, trying to understand not just what they did but why the existing tools had settled into the shapes they had.</p>

<h2 id="what-they-were-actually-building">What they were actually building</h2>

<p>What became clear, quickly, was that the file format was everything. How you represented a design — what data structure you used, how you stored the hierarchy of layers and components, how you encoded positions and relationships — determined what collaboration could mean. Most design tools had inherited their file formats from a generation of software built for local storage. The file was a snapshot. You opened it, you worked, you saved. The structure was optimized for that workflow.</p>

<p>Figma needed a structure optimized for something different: a persistent, shared, live document that could be edited by multiple people simultaneously without corruption. This meant thinking about operational transforms — the same technology that made Google Docs work — but applied to a vastly more complex data model. A text document has a linear structure. A design file is a tree: layers nested inside frames nested inside pages, with components pointing to other components, styles cascading from shared libraries, and constraints defining how everything responds when the frame changes size.</p>

<p>The technical solution Wallace arrived at was elegant in a way that would take years for the industry to fully appreciate. Rather than treating the design as a document that got transmitted and synchronized, Figma treated every element as a node in a graph with a unique persistent identifier. Operations weren't "move this shape" but "update the x-property of node ID 7f3a2c to 240." Those operations could be transmitted, replayed, and merged in a way that preserved the designer's intent even when two people were editing simultaneously.</p>

<p>It sounds like an implementation detail. It turned out to be the entire product strategy.</p>

<h2 id="the-physics-problem-underneath">The physics problem underneath</h2>

<p>The rendering problem was equally daunting. Wallace's background in computer graphics gave him an unusual perspective on what the browser could theoretically do versus what it was currently doing. The bottleneck wasn't the processor. It was the pathway between the processor and the display. Design tools needed to render complex vector graphics at interactive speeds — sixty frames per second as you dragged and transformed shapes. The browser in 2012 was far from capable of this using its standard rendering path.</p>

<p>Wallace's insight was to route around the standard path entirely. WebGL existed — a browser API that provided direct access to the GPU — but it had been designed for 3D graphics. Using it for 2D vector rendering required solving a set of mathematical problems that sat at the intersection of computational geometry and GPU programming. How do you tessellate an arbitrary bezier curve into triangles that the GPU can render? How do you handle anti-aliasing? How do you make fills and strokes work correctly at every zoom level?</p>

<p>Wallace solved them. The Figma rendering engine he built was eventually fast enough that designers who switched from Sketch would sometimes think there was something wrong — their designs rendered so quickly that they assumed they were seeing a preview rather than the actual document.</p>

<p>This wasn't just technical craftsmanship. It was a business decision embedded in engineering. If Figma had been slow, the collaboration features wouldn't have mattered. Designers would have dismissed it as a web toy and returned to their desktop apps. Speed was the prerequisite for everything else.</p>

<h2 id="the-collaboration-nobody-wanted">The collaboration nobody wanted</h2>

<p>When Figma launched its first beta in 2016, the reaction from the design community was skeptical in ways that the team had not fully anticipated. Designers didn't ask for collaboration. They had been working alone for their entire careers. The Dropbox folder problem didn't feel like a problem because it was invisible — you didn't know how much time you were losing to it until you stopped losing it.</p>

<p>The more pointed objection was that designers didn't want other people in their files while they worked. Design was a process of iterating through ugly intermediary states — the half-formed comp, the layout that wasn't working, the exploration that would be discarded. The prospect of a product manager or an engineer being able to see that process in real time felt exposing. The locked desktop file wasn't just a workflow artifact; it was a kind of professional protection.</p>

<p>Field encountered this objection in nearly every sales conversation. His answer was to reframe what the product was for. Figma wasn't primarily a tool for making design more transparent to non-designers, he argued. It was a tool for making designers more efficient with each other. The team that needed to collaborate most urgently was the design team — multiple designers working on the same product, needing to share components, review each other's work, and hand off to engineering without the file-format degradation that happened when you exported from Sketch and tried to get the measurements into Zeplin and then communicated them through a JIRA ticket.</p>

<p>This framing worked, slowly. Design teams started adopting Figma not for the real-time cursors — which remained more of a demo feature than a daily workflow — but for the shared libraries, the comment threads, the ability to send a link to anyone who needed to see the work without requiring them to have the software installed.</p>

<h2 id="three-years-of-not-charging">Three years of not charging</h2>

<p>Between 2016 and 2019, Figma grew rapidly and charged almost no one. The free tier was generous to the point of being the entire product for most users. A designer could use Figma forever without paying — unlimited files, unlimited collaborators, just a cap on the number of projects. The company was burning investor money to acquire users, which was familiar Silicon Valley behavior, but the specific calculation Field was making was unusual.</p>

<p>He believed that design tools had a virality property that most software didn't. When a designer shared a Figma link — to a client, to an engineer, to a stakeholder reviewing a prototype — the recipient had to open it in a browser. They saw the interface. They saw how it worked. They saw the collaboration features. They could leave comments directly on the design. The shared link was a product demo that happened naturally as part of the designer's normal workflow, reaching exactly the people who had authority to approve software purchases for their organizations.</p>

<p>This was the strategy compressed into a sentence: the file was the product, and the link was the distribution mechanism. Every shared Figma file was a sales call that the product made on behalf of itself, to an audience that had already opted in by being sent a link by someone they trusted.</p>

<p>The bet required patience and capital. It also required not flinching when the design community periodically complained that Figma would eventually "enshittify" once it needed to monetize. Field's response was consistent: the business model would be enterprise — large companies paying for teams, admin controls, SSO, audit logs, and the security features that IT departments required. Individual designers would remain free. The free tier wasn't a trial; it was the product's distribution strategy.</p>

<h2 id="how-sketch-lost-and-invision-disappeared">How Sketch lost and InVision disappeared</h2>

<p>Sketch had been the design tool for a generation of product designers. It launched in 2010, hit its stride between 2013 and 2016, and achieved a kind of cultural dominance that made it feel permanent. The Mac-only limitation was a badge of honor: real designers used Macs, therefore Sketch being Mac-only was a feature. The Sketch file format became an ecosystem — plugins, asset libraries, handoff tools, entire startups built on top of it.</p>

<p>Sketch's response to Figma was slow, then panicked, then too late. A cloud collaboration product launched in 2017 and spent two years being demonstrably inferior. By the time Sketch had something competitive, the enterprise deals had already been signed. Design teams at Dropbox, Uber, and GitHub had standardized on Figma. When a new hire joined, they were onboarded to Figma. The installed base had inverted.</p>

<p>InVision had a different failure mode. It had been built as a prototyping tool — a way to link Sketch artboards together and share clickable prototypes with stakeholders. It raised enormous amounts of money and diversified into Craft plugins, design systems management, a whiteboard product, and eventually an attempt at a full design tool called Studio. None of these achieved the network effects that InVision needed. The company that had been valued at nearly two billion dollars was quietly winding down its core product by 2023, asking users to export their files before the service shut off.</p>

<p>The lesson observers drew was about technical moats and first-mover advantage in infrastructure. Once a design team's component library, shared styles, and file structure were in Figma, switching was expensive. The link-as-distribution strategy had created lock-in through habit rather than data hostage-taking — designers stayed not because they couldn't leave but because leaving meant rebuilding everything their team had accumulated.</p>

<h2 id="the-management-crisis">The management crisis</h2>

<p>By 2020, Figma was the dominant design tool in professional product development. It was also a company in transition. The pandemic had accelerated remote work, which accelerated the need for collaborative design software, which accelerated Figma's growth in a way that strained organizational infrastructure. Headcount doubled, then doubled again. The design tool itself was expanding — FigJam launched as a whiteboard product in 2021, design systems features deepened, auto-layout became sophisticated enough to start replacing some handoff work.</p>

<p>Field, who had been running the company since he was twenty years old, faced challenges he had not encountered during the leaner years. Scaling culture is different from building culture. The early team had been unusually coherent in its values — a combination of technical ambition and genuine care about the design profession. As the company grew, maintaining that coherence required deliberate effort. There were hiring decisions that didn't work out, organizational restructurings, and the particular difficulty of a founding CEO learning enterprise sales and corporate strategy in real time while also trying to stay close to product.</p>

<p>What the company managed, through this period, was to avoid the quality regression that typically accompanies rapid growth. Figma's core reliability — the thing it was always good at, the thing that had earned designer trust in the first place — held. The multiplayer rendering remained fast. Files didn't corrupt. The product shipped features that designers actually wanted rather than features that made good press releases.</p>

<h2 id="the-deal-that-suspended-everything">The deal that suspended everything</h2>

<p>In September 2022, Adobe announced it would acquire Figma for twenty billion dollars — the largest acquisition in the history of design software by a factor of roughly ten. The price represented a hundred times Figma's annual recurring revenue, which was either an extraordinary vote of confidence in the company's trajectory or a sign that Adobe was paying whatever it took to eliminate the threat to its Creative Cloud business.</p>

<p>The design community's reaction was immediate and largely hostile. Adobe had a complicated reputation among designers: the creator of tools that were indispensable and expensive, the company that had moved its software to a subscription model in a way many creatives had resented, and the organization that had tried and failed to build competitive web-native tools multiple times. The fear was that Figma would be absorbed, its best features paywalled, its free tier eliminated, and the culture that had made it distinctive would dissolve into a large company's organizational gravity.</p>

<p>The regulatory review that followed became a story of its own. The European Commission investigated the deal for nearly eighteen months, examining whether the combination of Adobe's market position in creative software with Figma's dominant position in UI design tools would harm competition. In December 2023, Adobe and Figma abandoned the acquisition after the EC signaled it would block it. Adobe paid Figma a one-billion-dollar breakup fee.</p>

<p>Field returned to running Figma as an independent company with a billion dollars in cash it hadn't raised, a design community that had rallied around its survival, and a clearer mandate than before: build the future of design tooling without the distraction of an acquisition process, and without the uncertainty that had hung over every product decision for fourteen months.</p>

<p>The link, it turned out, was still the strategy. The file was still the product. And the design industry, which had nearly lost the most interesting company in its history to an acquisition, was watching closely to see what Figma would do next.</p>
`;
