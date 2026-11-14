import React, { useState } from 'react';
import { X, Calendar, Clock, Building2, User, Package, Hash, CheckCircle2, ArrowRight, ExternalLink, Download, Flame, Zap, ShieldAlert, Droplets, Sparkles, Paintbrush } from 'lucide-react';
import { PowderCoatJob, JobStatus, JobPriority } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useRole } from '../context/RoleContext';

interface JobDetailModalProps {
  job: PowderCoatJob;
  onClose: () => void;
  onUpdateStatus: (jobId: string, status: JobStatus, extraData?: Partial<PowderCoatJob>) => void;
  onUpdatePriority?: (jobId: string, priority: JobPriority) => void;
  onOpenDispatch: (job: PowderCoatJob) => void;
  onOpenStartCoating?: (job: PowderCoatJob) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  onClose,
  onUpdateStatus,
  onUpdatePriority,
  onOpenDispatch,
  onOpenStartCoating,
}) => {
  const { lang, t } = useLanguage();
  const { isOperator } = useRole();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const getPriorityBadge = (priority?: JobPriority) => {
    switch (priority) {
      case 'URGENT':
        return {
          label: t.priorityUrgent,
          bg: 'bg-red-500/20 text-red-300 border-red-500 animate-pulse font-black',
        };
      case 'HIGH':
        return {
          label: t.priorityHigh,
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold',
        };
      case 'NORMAL':
      default:
        return {
          label: t.priorityNormal,
          bg: 'bg-slate-700/50 text-slate-300 border-slate-600',
        };
    }
  };

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'RECEIVED':
        return {
          label: t.statusReceived,
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          dot: 'bg-blue-400',
        };
      case 'IN_PROGRESS':
        return {
          label: t.statusInProgress,
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400',
        };
      case 'COMPLETED':
        return {
          label: t.statusCompleted,
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400',
        };
      case 'DISPATCHED_TO_PACKING': {
        const deptLabel = job.target_department ? ` (${job.target_department})` : '';
        return {
          label: `${t.statusDispatched}${deptLabel}`,
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          dot: 'bg-purple-400',
        };
      }
    }
  };

  const statusInfo = getStatusBadge(job.status);
  const priorityInfo = getPriorityBadge(job.priority);

  // คำนวณระยะเวลาพ่นสี
  const formatDuration = (start?: string, end?: string) => {
    if (!start) return '-';
    const startTime = new Date(start).getTime();
    const endTime = end ? new Date(end).getTime() : Date.now();
    const diffMinutes = Math.floor((endTime - startTime) / 60000);
    if (diffMinutes < 1) return '< 1 นาที';
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    if (hours === 0) return `${mins} นาที`;
    return `${hours} ชม. ${mins > 0 ? `${mins} นาที` : ''}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`bg-slate-900 border rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-8 ${
        job.priority === 'URGENT' ? 'border-red-500/80 shadow-red-950/60' : 'border-slate-800'
      }`}>
        {/* Urgent Alert Banner */}
        {job.priority === 'URGENT' && (
          <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-600 px-6 py-2.5 text-white flex items-center justify-between font-bold text-xs sm:text-sm shadow animate-pulse">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-bounce" />
              <span>{t.urgentBannerText}</span>
              <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-xs">{t.urgentNotice}</span>
            </div>
            <span className="text-xs bg-black/30 px-2 py-0.5 rounded font-mono">PRIORITY: URGENT</span>
          </div>
        )}

        {/* Header */}
        <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold">
              {job.tracking_code}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${priorityInfo.bg}`}
            >
              {priorityInfo.label}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusInfo.dot}`}></span>
              {statusInfo.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Supervisor Priority Quick Change Bar */}
        {onUpdatePriority && isOperator && (
          <div className="bg-slate-950/60 px-6 py-3 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-400 flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-orange-400" />
              <span>{t.supervisorPriorityLabel}</span>
            </span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => onUpdatePriority(job.id, 'URGENT')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                  job.priority === 'URGENT'
                    ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-900/50 ring-2 ring-red-400'
                    : 'bg-slate-800 text-red-300 border-red-900/50 hover:bg-red-950/40'
                }`}
              >
                {t.btnUrgent}
              </button>
              <button
                type="button"
                onClick={() => onUpdatePriority(job.id, 'HIGH')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                  job.priority === 'HIGH'
                    ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-900/50 ring-2 ring-amber-400'
                    : 'bg-slate-800 text-amber-300 border-amber-900/50 hover:bg-amber-950/40'
                }`}
              >
                {t.btnHigh}
              </button>
              <button
                type="button"
                onClick={() => onUpdatePriority(job.id, 'NORMAL')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  !job.priority || job.priority === 'NORMAL'
                    ? 'bg-slate-700 text-white border-slate-500 ring-1 ring-slate-400'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700/50'
                }`}
              >
                {t.btnNormal}
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Key Info Grid with Large Container No */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Model / Part No.</span>
              <span className="text-base font-bold text-white font-mono">{job.model_part_no}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">{t.partLabel}</span>
              <span className="text-base font-semibold text-orange-400">{job.part_name}</span>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2">
              <span className="text-xs text-amber-400 font-semibold block mb-0.5">{t.boxNotice}</span>
              <span className="text-base sm:text-lg font-black text-amber-300 font-mono tracking-wider">{job.container_no}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">{t.qtyLabel}</span>
              <span className="text-base font-bold text-emerald-400">{job.quantity} {t.pieceUnit}</span>
            </div>
          </div>

          {/* Real-time Coating & Hanger Status (Show when assigned) */}
          {(job.hanger_no || job.coating_type) && (
            <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/40 rounded-xl p-4 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl p-2.5 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/30 shadow-inner">
                  🪝
                </span>
                <div>
                  <span className="text-[11px] text-amber-400/90 font-bold uppercase tracking-wider block">
                    {t.badgeHanger} (HANGER NO.)
                  </span>
                  <span className="text-xl sm:text-2xl font-mono font-black text-white tracking-wider">
                    {job.hanger_no ? `#${job.hanger_no}` : '-'}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 w-full sm:w-auto justify-between sm:justify-start">
                <div className="p-2 rounded-lg bg-slate-800/80">
                  {job.coating_type === 'EDP_ONLY' ? (
                    <Droplets className="w-5 h-5 text-cyan-400" />
                  ) : job.coating_type === 'POWDER_ONLY' ? (
                    <Paintbrush className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    {t.labelCoatingType}
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-extrabold ${
                      job.coating_type === 'EDP_ONLY'
                        ? 'text-cyan-300'
                        : job.coating_type === 'POWDER_ONLY'
                        ? 'text-amber-300'
                        : 'text-purple-300'
                    }`}
                  >
                    {job.coating_type === 'EDP_ONLY'
                      ? t.coatingTypeEdpOnly
                      : job.coating_type === 'POWDER_ONLY'
                      ? t.coatingTypePowderOnly
                      : t.coatingTypeEdpAndPowder}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Timeline & Audit trail */}
          <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm">
            <h4 className="font-semibold text-slate-200 mb-3 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>{t.timelineTitle}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border-l-2 border-blue-500 pl-3">
                <span className="text-slate-400 block text-xs">{t.timelineReceived}</span>
                <span className="text-white font-medium block mt-0.5">
                  {new Date(job.received_at).toLocaleString(lang === 'my' ? 'en-GB' : 'th-TH')}
                </span>
                <span className="text-xs text-slate-400">
                  {t.labelSentBy}: {job.sender_name} ({job.sender_department})
                </span>
              </div>

              <div className="border-l-2 border-amber-500 pl-3">
                <span className="text-slate-400 block text-xs">{t.timelineStarted}</span>
                <span className="text-white font-medium block mt-0.5">
                  {job.coating_started_at
                    ? new Date(job.coating_started_at).toLocaleString(lang === 'my' ? 'en-GB' : 'th-TH')
                    : '-'}
                </span>
                <span className="text-xs text-slate-400 block">
                  {t.labelReceivedBy}: {job.receiver_name}
                </span>
                {job.hanger_no && (
                  <span className="text-[11px] font-mono font-bold text-amber-300 block mt-0.5">
                    🪝 #{job.hanger_no}
                  </span>
                )}
              </div>

              <div className="border-l-2 border-emerald-500 pl-3">
                <span className="text-slate-400 block text-xs">{t.timelineFinished}</span>
                <span className="text-white font-medium block mt-0.5">
                  {job.coating_finished_at
                    ? new Date(job.coating_finished_at).toLocaleString(lang === 'my' ? 'en-GB' : 'th-TH')
                    : '-'}
                </span>
                <span className="text-xs text-slate-400 block">{t.labelQcPassed}</span>
                {job.coating_started_at && (
                  <span className="text-[11px] font-mono text-emerald-300 font-bold block mt-0.5">
                    ⏱️ {t.labelDuration}: {formatDuration(job.coating_started_at, job.coating_finished_at)}
                  </span>
                )}
              </div>

              <div className="border-l-2 border-purple-500 pl-3">
                <span className="text-slate-400 block text-xs">
                  {t.timelineDispatched} {job.target_department ? `(${job.target_department})` : ''}
                </span>
                <span className="text-white font-medium block mt-0.5">
                  {job.dispatched_at
                    ? new Date(job.dispatched_at).toLocaleString(lang === 'my' ? 'en-GB' : 'th-TH')
                    : '-'}
                </span>
                {job.target_department && (
                  <span className="text-xs text-purple-300 font-semibold block">
                    🏢 {job.target_department}
                  </span>
                )}
                <span className="text-xs text-slate-400 block">
                  {t.labelDispatchedTo}: {job.packing_receiver_name || '-'}
                </span>
              </div>
            </div>

            {job.notes && (
              <div className="mt-4 pt-3 border-t border-slate-700/60 text-xs text-slate-300">
                <span className="text-slate-400 font-semibold">{t.labelNotes}: </span>
                {job.notes}
              </div>
            )}
          </div>

          {/* Evidence Photos: 1. ขาเข้า */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200 flex items-center space-x-1.5 text-xs sm:text-sm">
              <span>📥 {t.incomingPhotosTitle}</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Photo 1: Slip */}
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-orange-300">1. {t.slipPhotoLabel} (รับเข้า)</span>
                  {job.delivery_slip_image_url && (
                    <a
                      href={job.delivery_slip_image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{t.btnOpenFullImage}</span>
                    </a>
                  )}
                </div>
                <div
                  onClick={() => setSelectedPhoto(job.delivery_slip_image_url)}
                  className="aspect-video bg-black/40 rounded-lg overflow-hidden border border-slate-700/80 cursor-pointer group relative"
                >
                  <img
                    src={job.delivery_slip_image_url}
                    alt={t.slipPhotoLabel}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity">
                    {t.clickToZoom}
                  </div>
                </div>
              </div>

              {/* Photo 2: Part */}
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-orange-300">2. {t.partPhotoLabel} (รับเข้า)</span>
                  {job.part_image_url && (
                    <a
                      href={job.part_image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{t.btnOpenFullImage}</span>
                    </a>
                  )}
                </div>
                <div
                  onClick={() => setSelectedPhoto(job.part_image_url)}
                  className="aspect-video bg-black/40 rounded-lg overflow-hidden border border-slate-700/80 cursor-pointer group relative"
                >
                  <img
                    src={job.part_image_url}
                    alt={t.partPhotoLabel}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity">
                    {t.clickToZoom}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence Photos: 2. ขาออก (ถ้ามี) */}
          {(job.dispatch_slip_image_url || job.dispatch_part_image_url) && (
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <h4 className="font-semibold text-purple-300 flex items-center space-x-1.5 text-xs sm:text-sm">
                <span>📤 {t.dispatchPhotosTitle}</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.dispatch_slip_image_url && (
                  <div className="bg-purple-950/20 p-3 rounded-xl border border-purple-800/60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-purple-300">1. {t.dispatchSlipPhoto}</span>
                      <a
                        href={job.dispatch_slip_image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-purple-400 hover:text-white flex items-center space-x-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{t.btnOpenFullImage}</span>
                      </a>
                    </div>
                    <div
                      onClick={() => setSelectedPhoto(job.dispatch_slip_image_url || null)}
                      className="aspect-video bg-black/40 rounded-lg overflow-hidden border border-purple-800/40 cursor-pointer group relative"
                    >
                      <img
                        src={job.dispatch_slip_image_url}
                        alt="Dispatch Slip"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity">
                        {t.clickToZoom}
                      </div>
                    </div>
                  </div>
                )}

                {job.dispatch_part_image_url && (
                  <div className="bg-purple-950/20 p-3 rounded-xl border border-purple-800/60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-purple-300">2. {t.dispatchPartPhoto}</span>
                      <a
                        href={job.dispatch_part_image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-purple-400 hover:text-white flex items-center space-x-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{t.btnOpenFullImage}</span>
                      </a>
                    </div>
                    <div
                      onClick={() => setSelectedPhoto(job.dispatch_part_image_url || null)}
                      className="aspect-video bg-black/40 rounded-lg overflow-hidden border border-purple-800/40 cursor-pointer group relative"
                    >
                      <img
                        src={job.dispatch_part_image_url}
                        alt="Dispatch Part"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity">
                        {t.clickToZoom}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Workflow Action Buttons */}
        <div className="bg-slate-800/60 px-6 py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            {t.statusReceived}: <strong className="text-white">{statusInfo.label}</strong>
          </span>

          <div className="flex items-center space-x-2">
            {isOperator && (
              <>
                {job.status === 'RECEIVED' && (
                  <button
                    onClick={() => {
                      if (onOpenStartCoating) {
                        onOpenStartCoating(job);
                      } else {
                        onUpdateStatus(job.id, 'IN_PROGRESS');
                      }
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow transition-colors flex items-center space-x-1.5"
                  >
                    <span>🪝</span>
                    <span>{t.btnStartCoating}</span>
                  </button>
                )}

                {job.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => {
                      onUpdateStatus(job.id, 'COMPLETED');
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.btnFinishCoating}</span>
                  </button>
                )}

                {job.status === 'COMPLETED' && (
                  <button
                    onClick={() => {
                      onOpenDispatch(job);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow transition-colors flex items-center space-x-1.5"
                  >
                    <span>{t.btnHandoverPacking}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium"
            >
              {t.btnClose}
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Photo Zoom */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <img
              src={selectedPhoto}
              alt="Zoomed"
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black text-white rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
