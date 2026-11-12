import React, { useState } from 'react';
import { X, Calendar, Clock, Building2, User, Package, Hash, CheckCircle2, ArrowRight, ExternalLink, Download } from 'lucide-react';
import { PowderCoatJob, JobStatus } from '../types';

interface JobDetailModalProps {
  job: PowderCoatJob;
  onClose: () => void;
  onUpdateStatus: (jobId: string, status: JobStatus) => void;
  onOpenDispatch: (job: PowderCoatJob) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  onClose,
  onUpdateStatus,
  onOpenDispatch,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'RECEIVED':
        return {
          label: 'รับเข้าแล้ว (รอพ่น)',
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          dot: 'bg-blue-400',
        };
      case 'IN_PROGRESS':
        return {
          label: 'กำลังพ่นสี (In Progress)',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400',
        };
      case 'COMPLETED':
        return {
          label: 'พ่นสีเสร็จสมบูรณ์',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400',
        };
      case 'DISPATCHED_TO_PACKING':
        return {
          label: 'ส่งมอบแผนกแพ็คกิ้งแล้ว',
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          dot: 'bg-purple-400',
        };
    }
  };

  const statusInfo = getStatusBadge(job.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-800/80 px-6 py-4 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold">
              {job.tracking_code}
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

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Key Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-xs text-slate-400 block mb-1">Model / Part No.</span>
              <span className="text-base font-bold text-white font-mono">{job.model_part_no}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">ชิ้นส่วน (Part)</span>
              <span className="text-base font-semibold text-orange-400">{job.part_name}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">หมายเลขตู้สินค้า</span>
              <span className="text-base font-semibold text-white">{job.container_no}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">จำนวน</span>
              <span className="text-base font-bold text-emerald-400">{job.quantity} ชิ้น</span>
            </div>
          </div>

          {/* Timeline & Audit trail */}
          <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm">
            <h4 className="font-semibold text-slate-200 mb-3 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>ประวัติและวันเวลารับเข้า - ส่งมอบ</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border-l-2 border-blue-500 pl-3">
                <span className="text-slate-400 block text-xs">รับเข้าแผนกพ่นสี</span>
                <span className="text-white font-medium block mt-0.5">
                  {new Date(job.received_at).toLocaleString('th-TH')}
                </span>
                <span className="text-xs text-slate-400">
                  ส่งโดย: {job.sender_name} ({job.sender_department})
                </span>
              </div>

              <div className="border-l-2 border-amber-500 pl-3">
                <span className="text-slate-400 block text-xs">เริ่มกระบวนการพ่น</span>
                <span className="text-white font-medium block mt-0.5">
                  {job.coating_started_at
                    ? new Date(job.coating_started_at).toLocaleString('th-TH')
                    : '-'}
                </span>
                <span className="text-xs text-slate-400">ผู้รับงาน: {job.receiver_name}</span>
              </div>

              <div className="border-l-2 border-emerald-500 pl-3">
                <span className="text-slate-400 block text-xs">พ่นสีเสร็จสมบูรณ์</span>
                <span className="text-white font-medium block mt-0.5">
                  {job.coating_finished_at
                    ? new Date(job.coating_finished_at).toLocaleString('th-TH')
                    : '-'}
                </span>
                <span className="text-xs text-slate-400">ตรวจผ่าน QC สี</span>
              </div>

              <div className="border-l-2 border-purple-500 pl-3">
                <span className="text-slate-400 block text-xs">ส่งต่อแผนกแพ็คกิ้ง</span>
                <span className="text-white font-medium block mt-0.5">
                  {job.dispatched_at
                    ? new Date(job.dispatched_at).toLocaleString('th-TH')
                    : '-'}
                </span>
                <span className="text-xs text-slate-400">
                  ผู้รับ: {job.packing_receiver_name || '-'}
                </span>
              </div>
            </div>

            {job.notes && (
              <div className="mt-4 pt-3 border-t border-slate-700/60 text-xs text-slate-300">
                <span className="text-slate-400 font-semibold">หมายเหตุ: </span>
                {job.notes}
              </div>
            )}
          </div>

          {/* Evidence Photos */}
          <div>
            <h4 className="font-semibold text-slate-200 mb-3 flex items-center space-x-1.5">
              <span>รูปภาพหลักฐานในระบบ (คลิกที่ภาพเพื่อขยาย)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Photo 1: Slip */}
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-orange-300">1. ใบส่งมอบงาน</span>
                  {job.delivery_slip_image_url && (
                    <a
                      href={job.delivery_slip_image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>เปิดภาพเต็ม</span>
                    </a>
                  )}
                </div>
                <div
                  onClick={() => setSelectedPhoto(job.delivery_slip_image_url)}
                  className="aspect-video bg-black/40 rounded-lg overflow-hidden border border-slate-700/80 cursor-pointer group relative"
                >
                  <img
                    src={job.delivery_slip_image_url}
                    alt="ใบส่งมอบงาน"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity">
                    คลิกเพื่อซูมดูรูป
                  </div>
                </div>
              </div>

              {/* Photo 2: Part */}
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-orange-300">2. ตัวชิ้นงานจริง</span>
                  {job.part_image_url && (
                    <a
                      href={job.part_image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>เปิดภาพเต็ม</span>
                    </a>
                  )}
                </div>
                <div
                  onClick={() => setSelectedPhoto(job.part_image_url)}
                  className="aspect-video bg-black/40 rounded-lg overflow-hidden border border-slate-700/80 cursor-pointer group relative"
                >
                  <img
                    src={job.part_image_url}
                    alt="ตัวชิ้นงาน"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity">
                    คลิกเพื่อซูมดูรูป
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Workflow Action Buttons */}
        <div className="bg-slate-800/60 px-6 py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-400">
            สถานะปัจจุบัน: <strong className="text-white">{statusInfo.label}</strong>
          </span>

          <div className="flex items-center space-x-2">
            {job.status === 'RECEIVED' && (
              <button
                onClick={() => {
                  onUpdateStatus(job.id, 'IN_PROGRESS');
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow transition-colors flex items-center space-x-1.5"
              >
                <span>เริ่มพ่นสี</span>
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
                <span>พ่นสีเสร็จสมบูรณ์</span>
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
                <span>ส่งมอบให้แผนกแพ็คกิ้ง</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-medium"
            >
              ปิดหน้าต่าง
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
