import React from 'react';
import {
  MagnifyingGlassIcon,
  TagIcon,
  MapPinIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  TrashIcon,
  BuildingOfficeIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  LinkIcon,
  PencilSquareIcon,
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  XMarkIcon,
  ExclamationCircleIcon,
  GlobeAltIcon,
  SparklesIcon,
  ArrowPathIcon,
  HomeIcon,
  ChartBarIcon,
  Cog8ToothIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

export const NavHome = HomeIcon;
export const NavTracker = ChartBarIcon;
export const NavSettings = Cog8ToothIcon;

export const Grip = props => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);
export const Search = MagnifyingGlassIcon;
export const Tag = TagIcon;
export const MapPin = MapPinIcon;
export const ChevronDown = ChevronDownIcon;
export const ChevronLeft = ChevronLeftIcon;
export const ChevronRight = ChevronRightIcon;
export const Check = CheckIcon;
export const Trash = TrashIcon;
export const Building = BuildingOfficeIcon;
export const User = UserIcon;
export const Calendar = CalendarIcon;
export const FileText = DocumentTextIcon;
export const Link = LinkIcon;
export const Edit = PencilSquareIcon;
export const ExternalLink = ArrowTopRightOnSquareIcon;
export const Copy = DocumentDuplicateIcon;
export const CheckSquare = CheckCircleIcon;
export const XSquare = XMarkIcon;
export const AlertCircle = ExclamationCircleIcon;
export const Globe = GlobeAltIcon;
export const Sparkles = SparklesIcon;
export const Reset = ArrowPathIcon;
export const Filter = FunnelIcon;
