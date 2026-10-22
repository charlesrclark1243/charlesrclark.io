import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface Milestone {
  period: string;
  title: string;
  organization: string;
  description: string;
  kind: 'Education' | 'Research' | 'Teaching' | 'Publications' | 'Personal';
  image?: string;
  imageAlt?: string;
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.html',
  styleUrl: './timeline.css',
})
export class Timeline implements AfterViewInit, OnDestroy {
  @ViewChildren('milestone') private milestones!: QueryList<ElementRef<HTMLElement>>;
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  readonly events: Milestone[] = [
    {
      period: 'Aug 2018',
      title: 'Start of Undergraduate Studies',
      organization: 'SUNY Stony Brook',
      kind: 'Education',
      description:
        'Began undergraduate studies as a Mechanical Engineering major, later switching to Applied Mathematics & Statistics.',
    },
    {
      period: 'Summer 2020',
      title: 'First Time as a Teaching Assistant',
      organization: 'SUNY Stony Brook',
      kind: 'Teaching',
      description:
        'Assisted in teaching a course on Linear Algebra (AMS 210), helping students understand the material and grading assignments. Would serve as a teaching assistant for a course in Data Structures (CSE 214) the following summer, teaching recitation sections and holding office hours for students.',
    },
    {
      period: 'May 2022',
      title: 'B.S. in Applied Mathematics & Statistics and Economics (Minor in CS)',
      organization: 'SUNY Stony Brook',
      kind: 'Education',
      description:
        'Completed undergraduate studies with a 3.91/4.00 GPA, graduating summa cum laude.',
    },
    {
      period: 'Summer 2022',
      title: 'Change of Course',
      organization: 'N/A',
      kind: 'Personal',
      description:
        'Experienced a long-lasting health crisis which directly led me to eventually pursue a PhD in a lab which focuses on addressing the very same health issues I had experienced.',
    },
    {
      period: 'Aug 2022',
      title: "Start of Master's Studies at Georgia Tech",
      organization: 'Georgia Institute of Technology',
      kind: 'Education',
      description:
        "Began graduate studies as a CS Master's student in the College of Computing at Georgia Tech.",
    },
    {
      period: 'May 2024',
      title: 'Start of Graduate Research with the Human-Augmented Analytics Group (HAAG)',
      organization: 'Georgia Institute of Technology',
      kind: 'Research',
      description:
        'Started working as a Graduate Researcher in the Human-Augmented Analytics Group (HAAG) under the mentorship of Dr. Breanna D. Shi.',
    },
    {
      period: 'May 2025',
      title: 'M.S. in Computer Science (Specialization in ML)',
      organization: 'Georgia Institute of Technology',
      kind: 'Education',
      description:
        'Completed graduate studies with a 4.00/4.00 GPA, graduating with a Master of Science in Computer Science (Specialization in Machine Learning).',
      image: 'assets/timeline/buzz.jpg',
      imageAlt:
        "Me standing next to Buzz (Georgia Tech's mascot) at graduation, wearing a graduation cap and gown.",
    },
    {
      period: 'May 2025',
      title: 'Start work as a Teaching Assistant for HAAG',
      organization: 'Georgia Institute of Technology',
      kind: 'Teaching',
      description:
        'Started working as a teaching assistant for the Human-Augmented Analytics Group (HAAG), assisting in running their CS 8903/6999 course offerings.',
    },
    {
      period: 'July 2025',
      title: 'First Peer-Reviewed Publication',
      organization: 'Georgia Institute of Technology',
      kind: 'Publications',
      description:
        "Published my first peer-reviewed paper with the Human-Augmented Analytics Group (HAAG) in ACM's PEARC 2025 conference, winning the Best Paper Award.",
    },
    {
      period: 'Aug 2025',
      title: 'Start of PhD Studies at University of Florida',
      organization: 'University of Florida',
      kind: 'Education',
      description:
        'Began CS PhD studies and a position as a Graduate Research Assistant in the Boucher Lab at the University of Florida, under the mentorship of Dr. Christina Boucher.',
      image: 'assets/timeline/mala.jpg',
      imageAlt:
        'A photo of the main entrance to Malachowsky Hall on UF campus, where the Boucher Lab is located.',
    },
    {
      period: 'October 2026',
      title: 'Finalized my Dissertation Committee',
      organization: 'University of Florida',
      kind: 'Education',
      description:
        'Finalized my dissertation committee, which consists of Dr. Christina Boucher (chair), Dr. Sanjay Ranka, Dr. Alireza Entezari, and Dr. Simone Marini.',
    },
  ];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('timeline-visible');
            this.observer?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
    );

    this.milestones.forEach((item, index) => {
      const element = item.nativeElement;
      element.style.setProperty('--reveal-delay', `${(index % 4) * 90}ms`);
      element.classList.add('timeline-will-reveal');
      this.observer?.observe(element);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
